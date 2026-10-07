# https://libevent.org
# https://github.com/libevent/libevent

SRC_VER = 2.1.13-stable
SRC_NAME=libevent-$(SRC_VER)
SRC_URL=https://github.com/libevent/libevent/releases/download/release-$(SRC_VER)/$(SRC_NAME).tar.gz

all: download_test extract_test config_test
	$(MAKE) -j$(HOST_NCPU) -C $(SRC_NAME)

download_test:
	( if [ ! -f $(SRC_NAME).tar.gz ]; then \
		wget -t5 --timeout=20 --no-check-certificate -O $(SRC_NAME).tar.gz $(SRC_URL) \
			|| rm -f $(SRC_NAME).tar.gz; \
	fi )

extract_test:
	( if [ ! -d $(SRC_NAME) ]; then \
		tar zxf $(SRC_NAME).tar.gz; \
	fi )

config_test:
	( if [ -f ./config_done ]; then \
		echo "the same configuration"; \
	else \
		make configure && touch config_done; \
	fi )

configure:
	( cd $(SRC_NAME); \
	./autogen.sh; \
	./configure \
		--prefix=$(STAGEDIR) \
		--enable-static \
		--disable-shared \
		--disable-debug-mode \
		--disable-openssl \
		--disable-samples \
		--disable-libevent-regress \
		--host=$(HOST_TARGET) \
		--build=$(HOST_BUILD); \
	)

clean:
	if [ -f $(SRC_NAME)/Makefile ]; then \
		$(MAKE) -C $(SRC_NAME) distclean; \
	fi ; \
	rm -f config_done

install:
	$(MAKE) -C $(SRC_NAME) install DESTDIR=""

romfs:

