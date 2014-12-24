module.exports = {
	copy: {
		libs: {
			src: 'src/libs/**/*',
			out: 'build/libs'
		},
		access: {
			src: 'src/.htaccess',
			out: 'build'
		}
	},
	stylus: {
		base: 'src/css',
		watch: 'src/css/**/*.styl',
		src: ['src/css/base.styl', 'src/css/map.styl', 'src/css/about.styl', 'src/css/contact.styl', 'src/css/data.styl'],
		devOut: 'src/css',
		buildOut: 'build/css'
	},
	jade: {
		base: 'src',
		watch: 'src/**/*.jade',
		src: ['src/index.jade', 'src/about.jade', 'src/data.jade', 'src/contact.jade'],
		devOut: 'src',
		buildOut: 'build'
	}
};