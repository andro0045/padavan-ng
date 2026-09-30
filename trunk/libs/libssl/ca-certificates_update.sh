#! /bin/sh

# https://www.ccadb.org/resources
# https://wiki.mozilla.org/CA/Included_Certificates

set -e

SRC_CA_URL="https://ccadb.my.salesforce-sites.com/mozilla/IncludedRootsPEMTxt?TrustBitsInclude=Websites"

curl -L -s -f --connect-timeout 20 "$SRC_CA_URL" -o ca-certificates.new || rm -f ca-certificates.new

[ -s ca-certificates.new ] && (
    grep -q "BEGIN CERTIFICATE" ca-certificates.new \
        && dos2unix ca-certificates.new \
        && mv -f ca-certificates.new ca-certificates.crt
)
