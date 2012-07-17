set :application, "greeting2012summer"
set :repository,  "git@github.com:uniba/#{application}.git"

set :user, 'nulltask'

set :scm, :git
set :branch, "master"
set :scm_verbose, true
set :git_shallow_clone, 1

set :deploy_to, "~/app/#{application}"
set :deploy_via, :copy

set :node_env, 'production'
set :node_port, 8383

set :default_environment, {
  'PATH' => "~/.nave/installed/0.6.20/bin:$PATH"
}

default_run_options[:pty] = true

role :web, "house.local"
role :app, "house.local"
role :db,  "house.local"

namespace :deploy do
  task :start, :roles => :app do
    run "NODE_ENV=#{node_env} PORT=#{node_port} forever start #{current_path}/app.js"
  end
  task :stop, :roles => :app do
    run "forever stop #{current_path}/app.js"
  end
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "NODE_ENV=#{node_env} PORT=#{node_port} forever restart #{current_path}/app.js"
  end
end

after "deploy:create_symlink", :roles => :app do
  run "ln -svf #{shared_path}/node_modules #{current_path}/node_modules"
  run "cd #{current_path} && npm install"
end

after "deploy:setup", :roles => :app do
  run "mkdir -p #{shared_path}/node_modules"
end
