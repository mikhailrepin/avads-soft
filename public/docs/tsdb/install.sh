#!/usr/bin/env bash
#--- Enable check error -------------------------
SYS_TRAP='trap "exit 1" ERR '
trap "exit 1" ERR 2>/dev/null
if [ "$?" != 0 ]; then
	SYS_TRAP="set -e"
	set -e 2>/dev/null
fi

SA_PATH=/opt/avads_sa
SA_GROUP=$SA_USER
Service_PATH=/lib/systemd/system/avads_sa_service.service


sa_rm() {
	for file in "$@"; do
		[ -e "$file" ] || continue
		rm -rf "$file"
	done
}

sa_kill(){
	kill -INT \$@ 2>/dev/null
}

install_sa_bin() {
	echo -n "Install AVADS SA...       "
	sa_unzip $SA_TAR $SA_PATH 1>/dev/null
	[ "$SA_USER" == "root" ] ||
		chown $SA_USER:$SA_GROUP -R $SA_PATH
	echo OK
}

sa_unzip() {
  if [ ! -f avads_sa.tar.gz ]; then
      echo "File avads_sa.tar.gz not found!"
      exit 1
  fi
  if ! mkdir $SA_PATH; then
      exit 1
  fi
  if ! tar -C $SA_PATH -xzf avads_sa.tar.gz; then
      exit 1
  fi
  if ! chmod +x "${SA_PATH}/db_core"; then
      exit 1
  fi
}

run_install() {
	echo "Install dir: $SA_PATH"

  if [[ "$(whoami)" != root ]]; then
    echo "Only user root can run this script."
    exit 1
  fi

  if [ -d $SA_PATH ]; then
      echo "A previous version of the \"AVADS SA\" was detected. If you continue with the installation, all settings of the installed version will be deleted. Are you sure you want to continue?"
          read -n1 -p "Do you want continue? [y/N] " ynq
          case $ynq in
          [Yy]* ) sa_rm $SA_PATH;;
          [Nn]*|*)
            printf "\nInstall canceled."
            exit 0;;
          esac
          systemctl stop avads_sa_service
  fi

  sa_unzip
}

create_systemd() {
		cat >$Service_PATH <<EOT
[Unit]
Description=AVADS SA
ConditionPathExists=$SA_PATH/db_core
After=network.target

[Service]
Type=simple
User=root

Restart=always
RestartSec=10
startLimitIntervalSec=60

WorkingDirectory=$SA_PATH
ExecStart=$SA_PATH/db_core

[Install]
WantedBy=multi-user.target
EOT
  chmod 755 $Service_PATH
  systemctl enable avads_sa_service.service
}

run_install
create_systemd
systemctl start avads_sa_service
printf "\nInstall complete."
printf "\nfor run server \"sudo systemctl start avads_sa_service\" \nfor stop server \"sudo systemctl stop avads_sa_service\""

exit 0