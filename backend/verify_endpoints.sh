#!/bin/bash

# Base URL
BASE_URL="http://localhost:8080/api"

# Login to get token (using a known user)
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@worktrack.com", "password":"admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed. Response: $LOGIN_RESPONSE"
  exit 1
fi

echo "Login successful. Token: $TOKEN"

# Test Work Plans Global Endpoint
echo "Testing GET /api/work-plans/global?year=2026..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/work-plans/global?year=2026" -H "Authorization: Bearer $TOKEN")

echo "Status Code: $STATUS_CODE"

if [ "$STATUS_CODE" -eq 401 ]; then
    echo "ERROR: Received 401 Unauthorized for Work Plans Global"
elif [ "$STATUS_CODE" -eq 200 ]; then
    echo "SUCCESS: Work Plans Global accessible"
else
    echo "WARNING: Received status $STATUS_CODE"
fi

# Test Users Operators Endpoint
echo "Testing GET /api/users/operators..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/users/operators" -H "Authorization: Bearer $TOKEN")

echo "Status Code: $STATUS_CODE"

if [ "$STATUS_CODE" -eq 401 ]; then
    echo "ERROR: Received 401 Unauthorized for Users Operators"
fi

# Test KPIs Endpoint
echo "Testing GET /api/kpis..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$BASE_URL/kpis" -H "Authorization: Bearer $TOKEN")

echo "Status Code: $STATUS_CODE"

if [ "$STATUS_CODE" -eq 401 ]; then
    echo "ERROR: Received 401 Unauthorized for KPIs"
fi
