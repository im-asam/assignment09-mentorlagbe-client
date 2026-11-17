#!/usr/bin/env bash
# Live smoke test for the deployed MentorLagbe client.
# Usage: ./scripts/smoke-test.sh [base-url]
# Defaults to the production Vercel URL. Exits non-zero on any failure.
set -u
BASE="${1:-https://assignment09-mentorlagbe-client.vercel.app}"
FAIL=0

check() { # path expected-status label
  local code
  code=$(curl -s --max-time 25 -o /dev/null -w "%{http_code}" "${BASE}${1}")
  if [ "$code" = "$2" ]; then
    echo "PASS  $3 ($1 -> $code)"
  else
    echo "FAIL  $3 ($1 -> $code, expected $2)"
    FAIL=1
  fi
}

check "/" 200 "home"
check "/tuitions" 200 "browse tuitions"
check "/pricing" 200 "pricing"
check "/sign-in" 200 "sign-in"
check "/sign-up" 200 "sign-up"
check "/payment/success" 200 "payment success"
check "/payment/cancel" 200 "payment cancel"
check "/dashboard" 200 "dashboard root"
check "/dashboard/student" 200 "student overview"
check "/dashboard/tutor" 200 "tutor overview"
check "/dashboard/admin" 200 "admin overview"
check "/dashboard/profile" 200 "profile"
check "/tuitions/000000000000000000000000" 200 "tuition details (missing id renders)"
check "/no-such-page" 404 "custom 404"

# Auth JWKS endpoint must answer (proves BetterAuth + JWT plugin are live).
code=$(curl -s --max-time 25 -o /dev/null -w "%{http_code}" "${BASE}/api/auth/jwks")
if [ "$code" = "200" ]; then
  echo "PASS  auth JWKS endpoint"
else
  echo "FAIL  auth JWKS endpoint (-> $code, expected 200)"
  FAIL=1
fi

# Home page must contain the hero headline.
if curl -s --max-time 25 "${BASE}/" | grep -q "Find Your Ideal Tutor"; then
  echo "PASS  home hero headline present"
else
  echo "FAIL  home hero headline missing"
  FAIL=1
fi

exit $FAIL
