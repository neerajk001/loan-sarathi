module.exports = {
    apps: [
        {
            name: 'loan-sarathi',
            script: 'npm',
            args: 'start',
            cwd: './frontend',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};
