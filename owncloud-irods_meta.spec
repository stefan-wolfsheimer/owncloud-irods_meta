%define _prefix         /var
%define _datadir        /var/www
%define owncloud_dir   	%{_datadir}/owncloud
%define apps_dir        %{owncloud_dir}/apps
%define apps_path       irods_meta
%{!?version: %define version 0.0.6}
%{!?release: %define release 0}

Name:           owncloud-irods_meta
Version:        %{version}
Release:        %{release}
Summary:        iRODS MetaData
License:        Apache 2
Group:          Applications/Internet
Distribution:   SURFsara
Vendor:         SURFsara
Packager:       Stefan Wolfsheimer <stefan.wolfsheimer@surfsara.nl>
AutoReqProv:    no
Requires:       owncloud >= 10.0.10
BuildArch:      noarch

%description
MetaData for iRODS

# %prep

%setup -q -n %{name}

%build
rm -rf %{name}-%{version}-%{release}
cp -r /host %{name}-%{version}-%{release}
cd %{name}-%{version}-%{release}
npm install
./node_modules/.bin/webpack-cli
cd ..

%install
mkdir -p %{buildroot}%{apps_dir}

# Start!
install -dm 755 %{buildroot}%{apps_dir}/%{apps_path}

# install content
for d in $(find %{name}-%{version}-%{release} -mindepth 1 -maxdepth 1 -type d \( ! -iname ".*" ! -iname config \) ); do
     cp -a "$d" %{buildroot}%{apps_dir}/%{apps_path}
done

# Copy files in root dir
for f in $(find %{name}-%{version}-%{release} -mindepth 1 -maxdepth 1 -type f \( ! -iname ".*" \
                                                                                 ! -iname node_modules \
                                                                                 ! -iname package.json
                                                                                 ! -iname webpack.config.js
                                                                                 ! -iname package-lock.json \)); do
   cp -a "$f" %{buildroot}%{apps_dir}/%{apps_path}/
   install -pm 644 "$f" %{buildroot}%{apps_dir}/%{apps_path}
done

# Alle rechten even goedzetten voor Apache
%files
%attr(-,apache,apache) %{apps_dir}/%{apps_path}

%changelog

* Wed Feb 5 2020 Stefan Wolfsheimer <stefan.wolfsheimer@surfsara.nl> v0.0.5-1
- layout improvements, part 3

* Mon Jan 20 2020 Stefan Wolfsheimer <stefan.wolfsheimer@surfsara.nl> v0.0.4-1
- layout improvements, part 2

* Mon Jan 15 2020 Stefan Wolfsheimer <stefan.wolfsheimer@surfsara.nl> v0.0.3-1
- layout improvements

* Mon Jan 13 2020 Stefan Wolfsheimer <stefan.wolfsheimer@surfsara.nl> v0.0.2-1
- Tag version

* Mon Oct 07 2019 Stefan Wolfsheimer <stefan.wolfsheimer@surfsara.nl> v0.0.1-1
- Package irods storage driver

