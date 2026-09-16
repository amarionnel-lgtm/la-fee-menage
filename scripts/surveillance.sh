#!/bin/bash
# Surveillance d'intégrité d'un site en production.
#
#   bash surveillance.sh https://le-site.fr --reference   enregistre l'empreinte
#   bash surveillance.sh https://le-site.fr               compare et alerte
#
# Pensé pour un site qui sort d'un piratage : il détecte une modification du
# contenu, la disparition des en-têtes de sécurité, et surtout le CLOAKING,
# c'est-à-dire un contenu différent servi aux robots et aux visiteurs. C'est
# exactement ce qui avait été fait à Armor Voiles : page blanche pour les
# humains, pages de spam japonais pour Googlebot, invisible pendant des mois.
#
# À planifier une fois par jour (cron, ou tâche planifiée) et à lire quand ça
# alerte. Sans référence enregistrée, la comparaison ne peut rien dire.

set -uo pipefail
SITE="${1:?usage: surveillance.sh https://le-site [--reference]}"
SITE="${SITE%/}"
REF_DIR="${HOME}/.claude/surveillance/$(echo "$SITE" | sed 's|https\?://||; s|[^a-zA-Z0-9]|-|g')"
MODE_REF=false
[[ "${2:-}" == "--reference" ]] && MODE_REF=true

UA_HUMAIN="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
UA_GOOGLE="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
UA_BING="Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"

vert=$'\033[32m'; rouge=$'\033[31m'; jaune=$'\033[33m'; gris=$'\033[90m'; fin=$'\033[0m'
alertes=0

mkdir -p "$REF_DIR"

# Les pages à surveiller : l'accueil, plus ce que le sitemap déclare (10 max).
pages=("/")
sitemap=$(curl -sS -A "$UA_HUMAIN" "$SITE/sitemap-0.xml" 2>/dev/null || true)
while read -r u; do
  # le sitemap porte le domaine définitif, qui diffère de l'URL testée en recette
  chemin=$(echo "$u" | sed -E 's|^https?://[^/]+||')
  [[ -n "$chemin" && "$chemin" != "/" ]] && pages+=("$chemin")
done < <(echo "$sitemap" | grep -o '<loc>[^<]*</loc>' | sed 's|<[^>]*>||g' | head -9)

echo
if $MODE_REF; then
  echo "ENREGISTREMENT DE LA RÉFÉRENCE · $SITE"
else
  echo "SURVEILLANCE · $SITE"
fi
echo "───────────────────────────────────────────────────────────"

# ── 1. contenu ─────────────────────────────────────────────────────────────
for p in "${pages[@]}"; do
  corps=$(curl -sS -A "$UA_HUMAIN" "$SITE$p" 2>/dev/null)
  empreinte=$(echo "$corps" | shasum -a 256 | cut -d' ' -f1)
  fichier="$REF_DIR/$(echo "$p" | sed 's|/|_|g').sha"

  if $MODE_REF; then
    echo "$empreinte" > "$fichier"
    printf "  ${gris}enregistré${fin}  %s\n" "$p"
  elif [[ -f "$fichier" ]]; then
    if [[ "$(cat "$fichier")" == "$empreinte" ]]; then
      printf "  ${vert}✓${fin} %s ${gris}inchangée${fin}\n" "$p"
    else
      printf "  ${jaune}~${fin} %s ${jaune}modifiée${fin} ${gris}(normal après un déploiement)${fin}\n" "$p"
    fi
  else
    printf "  ${gris}?${fin} %s ${gris}pas de référence${fin}\n" "$p"
  fi
done

$MODE_REF || {
  # ── 2. cloaking : le contenu change-t-il selon le visiteur ? ──────────────
  echo
  echo "Cloaking (contenu différent selon le visiteur)"
  h=$(curl -sS -A "$UA_HUMAIN" "$SITE/" 2>/dev/null)
  g=$(curl -sS -A "$UA_GOOGLE" "$SITE/" 2>/dev/null)
  b=$(curl -sS -A "$UA_BING" "$SITE/" 2>/dev/null)
  th=$(echo "$h" | wc -c | tr -d ' '); tg=$(echo "$g" | wc -c | tr -d ' '); tb=$(echo "$b" | wc -c | tr -d ' ')
  ecart=$(( tg > th ? tg - th : th - tg ))
  seuil=$(( th / 10 ))
  if [[ "$th" -lt 500 ]]; then
    printf "  ${rouge}✗ page quasi vide pour un visiteur (%s octets)${fin}\n" "$th"; alertes=$((alertes+1))
  elif [[ "$ecart" -gt "$seuil" ]]; then
    printf "  ${rouge}✗ CLOAKING PROBABLE : %s octets pour un visiteur, %s pour Googlebot${fin}\n" "$th" "$tg"; alertes=$((alertes+1))
  else
    printf "  ${vert}✓${fin} même contenu pour un visiteur, Googlebot et Bingbot ${gris}(%s / %s / %s octets)${fin}\n" "$th" "$tg" "$tb"
  fi

  # signatures de contenu injecté, dont celle du piratage japonais
  for motif in 'lang="ja"' 'yimg.jp' 'viagra' 'casino' 'replica' 'cheap-' '.ru/' 'display:none;position:absolute;left:-9'; do
    if grep -qiF "$motif" <<<"$g$h"; then
      printf "  ${rouge}✗ contenu suspect détecté : %s${fin}\n" "$motif"; alertes=$((alertes+1))
    fi
  done

  # ── 3. les protections tiennent-elles toujours ? ──────────────────────────
  echo
  echo "En-têtes de sécurité"
  entetes=$(curl -sSI -A "$UA_HUMAIN" "$SITE/" 2>/dev/null)
  for h in content-security-policy strict-transport-security x-content-type-options x-frame-options; do
    if grep -qi "^$h:" <<<"$entetes"; then printf "  ${vert}✓${fin} %s\n" "$h"
    else printf "  ${rouge}✗ %s absent${fin}\n" "$h"; alertes=$((alertes+1)); fi
  done
  if grep -qi "unsafe-inline" <<<"$entetes"; then
    printf "  ${rouge}✗ unsafe-inline réapparu dans la CSP${fin}\n"; alertes=$((alertes+1))
  fi

  # ── 4. le sitemap a-t-il été gonflé ? ─────────────────────────────────────
  echo
  n=$(echo "$sitemap" | grep -o '<loc>' | wc -l | tr -d ' ')
  ref_n="$REF_DIR/sitemap.count"
  if [[ -f "$ref_n" ]]; then
    attendu=$(cat "$ref_n")
    if [[ "$n" -gt $(( attendu + 20 )) ]]; then
      printf "  ${rouge}✗ le sitemap est passé de %s à %s URL : injection probable${fin}\n" "$attendu" "$n"; alertes=$((alertes+1))
    else
      printf "  ${vert}✓${fin} sitemap : %s URL ${gris}(référence : %s)${fin}\n" "$n" "$attendu"
    fi
  else
    printf "  ${gris}?${fin} sitemap : %s URL, pas de référence\n" "$n"
  fi

  echo "───────────────────────────────────────────────────────────"
  if [[ "$alertes" -eq 0 ]]; then
    printf "  ${vert}Rien à signaler.${fin}\n\n"
  else
    printf "  ${rouge}%s ALERTE(S) : à regarder tout de suite.${fin}\n\n" "$alertes"
    exit 2
  fi
}

$MODE_REF && {
  echo "$sitemap" | grep -o '<loc>' | wc -l | tr -d ' ' > "$REF_DIR/sitemap.count"
  echo "───────────────────────────────────────────────────────────"
  printf "  Référence enregistrée dans %s\n\n" "$REF_DIR"
}
