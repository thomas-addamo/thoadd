#!/usr/bin/env bash
# Salva Client ID e Client secret della GitHub OAuth App su Vercel (progetto thoadd-manage).
# I valori si incollano qui e vanno direttamente a Vercel: non finiscono in nessun file.
set -euo pipefail
cd "$(dirname "$0")/../apps/manage"

printf 'Incolla il Client ID della OAuth App e premi Invio: '
read -r client_id
printf 'Incolla il Client secret (non si vede mentre incolli) e premi Invio: '
read -rs client_secret
echo

[ -n "$client_id" ] && [ -n "$client_secret" ] || { echo "Uno dei due valori è vuoto: riprova."; exit 1; }

printf '%s' "$client_id" | npx vercel env add GITHUB_CLIENT_ID --environment production --type config --force --yes
printf '%s' "$client_secret" | npx vercel env add GITHUB_CLIENT_SECRET --environment production --type secret --force --yes

echo
echo "Fatto: le due chiavi sono su Vercel. Torna nella chat."
