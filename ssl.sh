#!/bin/bash
certbot --nginx \
  -d getpostforge.cloud \
  -d www.getpostforge.cloud \
  --agree-tos \
  -m maykelevoni@gmail.com \
  --redirect \
  --non-interactive
