## Сборка прошивок Padavan на серверах GitHub

Для личного использования

Каталог [`configs.build`](configs.build) содержит конфигурации маршрутизаторов для сборки прошивок в артефактах

Создание публичного релиза toolchain: [Actions](../../actions) → [Make toolchain release](../../actions/workflows/make_toolchain_release.yml)

Создание артефактов: [Actions](../../actions) → [Build firmware](../../actions/workflows/build.yml)

В файле [`variables`](variables) указывается репозиторий прошивки, ветка, конкретный тег или коммит, ссылка на заранее собранный toolchain для экономии времени компиляции прошивки.
Если ссылку на toolchain не указывать, то он будет скомпилирован перед сборкой прошивки.

Актуальные конфигурации поддерживаемых маршрутизаторов перечислены здесь: [templates](https://github.com/nilabsent/padavan-ng/tree/master/trunk/configs/templates)
