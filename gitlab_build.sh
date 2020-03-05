#!/bin/bash
set -x
set -e
NAME=owncloud-irods-meta
SPEC=${NAME}.spec

if [ -z "$CI_COMMIT_TAG" ]
then
    # release
    VERSION=${CI_COMMIT_TAG}
    RELEASE=0
    BRANCH=release
    REPO=DMS-RPM-Production
else
    VERSION=${CI_PIPELINE_ID}
    RELEASE=0
    BRANCH=${CI_COMMIT_REF_NAME}
    REPO=DMS-RPM-Testing
fi


RPM=${NAME}-${VERSION}-${RELEASE}.noarch.rpm

RPM=owncloud-irods-meta-${CI_COMMIT_TAG}-0.noarch.rpm
docker run -v ${SPEC_DIR}:/host --name owncloud-irods-meta-builder owncloud-rpm-builder \
       rpmbuild -ba /host/SPECS/${SPEC} --define "version ${VERSION}" --define "release ${RELEASE}" --define "branch $CI_COMMIT_REF_NAME"
docker cp owncloud-irods-meta-builder:/home/builder/rpm/noarch/${RPM} .

TARGET=Centos/7/irods-4.2.x/${BRANCH}/noarch/Packages/${RPM}

curl -H "X-JFrog-Art-Api:$ARTIE_KEY" -XPUT https://artie.ia.surfsara.nl/artifactory/${REPO}/${TARGET} -T ${RPM}
