DOCKERCOMMANDAPP := docker exec app bash -c
DOCKERCOMMANDMYSQL := docker exec mysql bash -c


help:
	@echo ""
	@echo "Welcome to supercontainer's build command center"
	@echo "----------------------------------------"
	@echo ""
	@echo "help                       Show this list."
	@echo "start                      Start docker."
	@echo "stop                       Stop docker."
	@echo ""
	@echo "docker-compose"
	@echo "    docker-compose/build   Docker compose build process."
	@echo ""
	@echo "docker"
	@echo "    docker/shell           Docker attach shell to app."
	@echo "    docker/logs            Docker log app."
	@echo ""
	@echo "server"
	@echo "    server/restart         Restart the dev server."
	@echo "    server/watch           Watchman restart the dev server."
	@echo "    server/status          Show pm2 status."
	@echo "    server/logs            Show server logs."
	@echo "    server/clear           Clear all server logs."
	@echo "    server/start           Start the dev server, webpack."
	@echo "    server/stop            Stop the dev server."
	@echo ""
	@echo "logs"
	@echo "    logs/clear             Clear logs."
	@echo ""
	@echo "test"
	@echo "    test/all               Test it all."
	@echo ""
	@echo "----------------------------------------"
	@echo "To get started run: make start"
	@echo ""

start: logs/clear watch
	@echo 'Starting docker...'
	@docker-compose up -d
	@${DOCKERCOMMANDAPP} "cd ./server && npm ci"
	@${DOCKERCOMMANDAPP} "npm install -g pm2 && npm install -g mocha"
	@${DOCKERCOMMANDAPP} "pm2 start dev.json"
	@${DOCKERCOMMANDMYSQL} "mysql -uroot -p'b33pb00p' -e 'CREATE DATABASE test;'"
	@${DOCKERCOMMANDMYSQL} "mysql -uroot -p'b33pb00p' -e 'GRANT ALL PRIVILEGES ON test.* TO \"supercontainer\"@\"%\";'"

restart:
	@echo 'Starting docker...'
	@docker-compose restart app

stop:
	@echo 'Stopping docker...'
	-@docker-compose down
	-@watchman shutdown-server

watch:
	-@watchman --logfile ~/Projects/supercontainer/logs/watchman.log watch-project .
	-@watchman -j < watchman.json

docker/shell:
	@${DOCKERCOMMANDAPP} "/bin/bash"

logs/clear:
	@echo 'Clearing all logs...'
	@echo > ./logs/server.log
	@echo > ./logs/watchman.log

server/status:
	@${DOCKERCOMMANDAPP} "pm2 status"

server/logs:
	@${DOCKERCOMMANDAPP} "pm2 log"

server/restart:
	@echo 'Starting/Restarting express server...'
	@${DOCKERCOMMANDAPP} "cd /var/www/app && pm2 start dev.json"

server/start: docker/start server/restart
	@echo 'Dev server started. Visit localhost:8081'

server/watch:
	@echo 'Wathman is restarting express server...'
	@docker exec app bash -c "cd /var/www/app && pm2 restart supercontainer"

server/stop: docker/stop server/clear
	@echo 'Stopped dev server and related services.'

test/all:
	@echo 'Restarting express server in testing env...'
	@${DOCKERCOMMANDAPP} "NODE_ENV=testing cd /var/www/app && pm2 start dev.json"
	@${DOCKERCOMMANDAPP} "cd /var/www/app && mocha ./server/routes/**/*.test.js --exit --config ./server/lib/test/config.js"
	@echo 'Restarting express server in development env...'
	@${DOCKERCOMMANDAPP} "NODE_ENV=development cd /var/www/app && pm2 start dev.json"
