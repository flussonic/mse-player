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

ci_dependencies:
	docker build -t mse-player-dependencies:${HTTP_BRANCH} --build-arg BRANCH=${HTTP_BRANCH} -f deploy/Dockerfile.dependencies .

ci_build_package:
	docker build -t mse-player-package:${HTTP_BRANCH} --build-arg BRANCH=${HTTP_BRANCH} -f deploy/Dockerfile.package.build .

ci_extract_package:
	rm -rf dist
	CONTAINER=$$(docker create mse-player-package:${HTTP_BRANCH}); \
	docker cp $${CONTAINER}:/root/dist . ;\
	docker rm -f $${CONTAINER}

ci_build_frontci:
	docker build -t mse-player-frontci:${HTTP_BRANCH} --build-arg BRANCH=${HTTP_BRANCH} -f deploy/Dockerfile.frontci.build .

ci_extract_frontci:
	rm -rf frontci
	CONTAINER=$$(docker create mse-player-frontci:${HTTP_BRANCH}); \
	docker cp $${CONTAINER}:/root/frontci . ;\
	docker rm -f $${CONTAINER}

ci_upload_frontci:
	for i in frontci/*; do \
	  curl -u ${FRONTCI_USER}:${FRONTCI_PASS} -T $${i} https://front-ci.erlyvideo.ru/dist/mse-player/${HTTP_BRANCH}/${VERSION}/`basename $${i}` || exit 1 ;\
	done

# ci_notify:
# 	curl -X POST --data-urlencode \
# 	'payload={"channel": "#dev-frontend", "username": "CI", "text": "**mse-player '${BRANCH}' '${VERSION}'** \nhttps://front-ci.erlyvideo.ru/"}' "${SLACKURL}"

ci: ci_prepare ci_dependencies ci_build_package ci_extract_package ci_build_frontci ci_extract_frontci ci_upload_frontci