ifeq (,$(BRANCH))
  BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
else
	BRANCH=master
endif

HTTP_BRANCH=$(shell echo ${BRANCH}| sed 's/\//-/')

ifeq (,$(VERSION))
  VERSION=$(shell git describe --abbrev=7 --long | sed 's/^v//g')
endif

ci_prepare:
	docker build -t mse-player-prepare:${HTTP_BRANCH} -f deploy/Dockerfile.prepare deploy

# ci_dependencies:
# 	docker build -t live-player-dependencies:${HTTP_BRANCH} --build-arg BRANCH=${HTTP_BRANCH} -f deploy/Dockerfile.dependencies .

# ci_build_frontci:
# 	docker build -t live-player-build-frontci:${HTTP_BRANCH} --build-arg BRANCH=${HTTP_BRANCH} -f deploy/Dockerfile.frontci.build .

# ci_extract_frontci:
# 	rm -rf frontci
# 	docker create --name extract-live-player-frontci-${HTTP_BRANCH} live-player-build-frontci:${HTTP_BRANCH}
# 	docker cp extract-live-player-frontci-${HTTP_BRANCH}:/root/frontci .
# 	docker rm -f extract-live-player-frontci-${HTTP_BRANCH}

# ci_build_flussonic:
# 	docker build -t live-player-build-flussonic:${HTTP_BRANCH} --build-arg BRANCH=${HTTP_BRANCH} --build-arg VERSION=${VERSION}  -f deploy/Dockerfile.flussonic.build .

# ci_extract_flussonic:
# 	rm -rf player
# 	docker create --name extract-live-player-player-${HTTP_BRANCH} live-player-build-flussonic:${HTTP_BRANCH}
# 	docker cp extract-live-player-player-${HTTP_BRANCH}:/root/player .
# 	docker rm -f extract-live-player-player-${HTTP_BRANCH}

# ci_upload_frontci:
# 	for i in frontci/*; do \
# 	  curl -u ${REPOSITORY_AUTH} -T $${i} https://front-ci.erlyvideo.ru/dist/live-player/${HTTP_BRANCH}/${VERSION}/`basename $${i}` || exit 1 ;\
# 	done

# ci_notify:
# 	curl -X POST --data-urlencode \
# 	'payload={"channel": "#dev-frontend", "username": "CI", "text": "**live-player '${BRANCH}' '${VERSION}'** \nhttps://front-ci.erlyvideo.ru/"}' "${SLACKURL}"


# ci: ci_prepare ci_dependencies ci_build ci_extract
