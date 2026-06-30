## Сборка прошивок Padavan на серверах GitHub

Для личного использования

Каталог [`configs.release`](configs.release) содержит конфигурации маршрутизаторов для сборки публичных релизов

Создание публичного релиза прошивок: [Actions](../../actions) → [Make firmware releases](../../actions/workflows/make_release.yml)

Создание публичного релиза toolchain: [Actions](../../actions) → [Make toolchain release](../../actions/workflows/make_toolchain_release.yml)

Каталог [`configs.build`](configs.build) содержит конфигурации маршрутизаторов для сборки прошивок в артефактах

Создание артефактов: [Actions](../../actions) → [Build firmware](../../actions/workflows/build.yml)

В файле [`variables`](variables) указывается репозиторий прошивки, ветка, конкретный тег или коммит, ссылка на заранее собранный toolchain для экономии времени компиляции прошивки.
Если ссылку на toolchain не указывать, то он будет скомпилирован перед сборкой прошивки.

Актуальные конфигурации поддерживаемых маршрутизаторов перечислены здесь: [templates](https://github.com/nilabsent/padavan-ng/tree/master/trunk/configs/templates)

В конфигурациях, на сколько позволяет размер флеш-памяти и аппаратные возможности маршрутизатора, по умолчанию содержатся: samba (smb2), minidlna, transmission, tor, ftp-сервер, sftp-сервер, ssh (dropbear, openssh), Openssl (1.0, 1.1, 3.0, 3.5 в зависимости от доступной памяти), Openvpn, DNSCrypt, DNS-over-TLS (stubby), DNS-over-HTTPS (https_dns_proxy), Wireguard либо AmneziaWG-1.5, Zapret, Zapret2

При наличии USB имеется поддержка некоторых модемов и следующих файловых систем: exfat, fat32, ntfs, ext2, ext3, ext4 (при форматировании надо удалять поддержку metadata_csum по причине старого ядра linux 3.4)
