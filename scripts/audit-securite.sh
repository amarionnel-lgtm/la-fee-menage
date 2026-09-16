#!/bin/bash
# Audit de sécurité d'un site statique en production.
#   bash audit-securite.sh https://exemple.vercel.app
# Ne modifie rien : il constate et note.

set -uo pipefail
SITE="${1:?usage: audit-securite.sh https://le-site}"
SITE="${SITE%/}"
points=0; total=0
vert=$'\033[32m'; rouge=$'\033[31m'; jaune=$'\033[33m'; gris=$'\033[90m'; fin=$'\033[0m'

entetes=$(curl -sSI "$SITE/" 2>/dev/null)

verifie() { # nom | motif attendu | poids
  local nom="$1" motif="$2" poids="${3:-1}"
  total=$((total + poids))
  if grep -qi "$motif" <<<"$entetes"; then
    points=$((points + poids)); printf "  ${vert}✓${fin} %s\n" "$nom"
  else
    printf "  ${rouge}✗${fin} %s\n" "$nom"
  fi
}

echo
echo "AUDIT DE SÉCURITÉ · $SITE"
echo "───────────────────────────────────────────────────────────"
echo "En-têtes"
verifie "Content-Security-Policy"            "^content-security-policy:" 3
verifie "Strict-Transport-Security"          "^strict-transport-security:" 2
verifie "  · avec preload"                   "strict-transport-security:.*preload"
verifie "X-Content-Type-Options: nosniff"    "^x-content-type-options: *nosniff"
verifie "X-Frame-Options: DENY"              "^x-frame-options: *DENY"
verifie "Referrer-Policy"                    "^referrer-policy:"
verifie "Permissions-Policy"                 "^permissions-policy:"
verifie "Cross-Origin-Opener-Policy"         "^cross-origin-opener-policy:"
verifie "Cross-Origin-Resource-Policy"       "^cross-origin-resource-policy:"
verifie "Origin-Agent-Cluster"               "^origin-agent-cluster:"

echo
echo "Qualité de la CSP"
csp=$(grep -i '^content-security-policy:' <<<"$entetes" | tr -d '\r')
for regle in "default-src 'none'|default-src verrouillé|2" \
             "object-src 'none'|object-src interdit|1" \
             "base-uri 'none'|base-uri interdit|1" \
             "frame-ancestors 'none'|frame-ancestors interdit|1" \
             "form-action|form-action déclaré|1"; do
  IFS='|' read -r motif nom poids <<<"$regle"
  total=$((total + poids))
  if grep -qF "$motif" <<<"$csp"; then points=$((points + poids)); printf "  ${vert}✓${fin} %s\n" "$nom"
  else printf "  ${rouge}✗${fin} %s\n" "$nom"; fi
done
for interdit in "unsafe-inline" "unsafe-eval" "'*'"; do
  total=$((total + 2))
  if grep -qF "$interdit" <<<"$csp"; then printf "  ${rouge}✗${fin} %s présent dans la CSP\n" "$interdit"
  else points=$((points + 2)); printf "  ${vert}✓${fin} aucun %s\n" "$interdit"; fi
done

echo
echo "Fichiers qui ne doivent pas être servis"
for f in .env .env.local .git/config package.json vercel.json .DS_Store; do
  total=$((total + 1))
  # suivre les redirections : trailingSlash renvoie un 308 avant le 404 final,
  # et juger sur le premier code ferait crier au loup pour rien
  code=$(curl -sSL -o /dev/null -w '%{http_code}' "$SITE/$f")
  if [ "$code" = "404" ] || [ "$code" = "403" ]; then
    points=$((points + 1)); printf "  ${vert}✓${fin} /%s → %s\n" "$f" "$code"
  else printf "  ${rouge}✗${fin} /%s → %s ${rouge}exposé${fin}\n" "$f" "$code"; fi
done

echo
echo "Transport"
total=$((total + 2))
if curl -sS -o /dev/null -w '%{http_version}' "$SITE/" | grep -q '^[23]'; then
  points=$((points + 1)); printf "  ${vert}✓${fin} HTTP/2 ou HTTP/3\n"; else printf "  ${jaune}~${fin} HTTP/1.1\n"; fi
tls=$(curl -sS -o /dev/null -w '%{ssl_verify_result}' "$SITE/")
if [ "$tls" = "0" ]; then points=$((points + 1)); printf "  ${vert}✓${fin} certificat TLS valide\n"
else printf "  ${rouge}✗${fin} certificat TLS : code %s\n" "$tls"; fi

echo
echo "Divulgation"
total=$((total + 1))
if curl -sS -o /dev/null -w '%{http_code}' "$SITE/.well-known/security.txt" | grep -q 200; then
  points=$((points + 1)); printf "  ${vert}✓${fin} security.txt publié\n"
else printf "  ${jaune}~${fin} pas de security.txt (RFC 9116)\n"; fi

echo "───────────────────────────────────────────────────────────"
note=$((points * 100 / total))
if [ "$note" -ge 95 ]; then couleur=$vert; elif [ "$note" -ge 80 ]; then couleur=$jaune; else couleur=$rouge; fi
printf "  Note : ${couleur}%s/100${fin}  (%s points sur %s)\n" "$note" "$points" "$total"
printf "  ${gris}Un audit d'en-têtes ne dit rien du DNS, du registrar ni du formulaire.${fin}\n\n"
