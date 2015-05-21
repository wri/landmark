# Global Map of Indigenous and Community Lands
> Please read before contributing

## Getting Started

### Installing node.js if you do not have it already.
<p>View the <a href='http://nodejs.org/'>node.js</a> homepage and install.</p>

### Installing Gulp if you do not have it already.
<p>View the <a href='http://gulpjs.com'>Gulp</a> homepage.  If you have node installed, you can just run: <pre><code>npm install --global gulp</code></pre></p>

### Clone the Repo
<p>If you haven't already done so, clone the repo.</p>

### Installing the remaining dependencies for Gulp.
<p>Make sure you are in the project folder you just cloned down and run <pre><code>npm install</code></pre></p>

### NOTE: For Mac users
<p>Installing node and any dependencies via <code>npm</code> may require you to run the commands with <code>sudo</code>.</p>

#### gulp watch
Run <code>gulp watch</code> from your project directory.  You can also run <code>npm start</code> which has been configured via the package.json.
<p>This will run a watch task to listen for any changes to any stylus files or jade files and compile them into css and  .</p>

#### gulp build
Run <code>npm run build</code> from your project directory.  If this fails on windows, may need to modify package.json script to properly remove the build directory before running the build task.  Optionally, if the build directory is not present, just run <code>gulp build</code>.
<p>This will do everything necessary to generate a minified build for this project.  This will remove the current build directory and replace it with the new build output so make sure you have a backup if your worried about breaking something.  It will minify images, .styl files, JavaScript, and html and will also copy over any remaining dependencies that are needed and place them in the build directory.</p>

#### Cache Bust Mechanism
There is a cache busting mechanism in place for when we deploy updates of the application.  To use this, in the `gulp-config.js` file, increment the appVersion variable right near the top.  The Map page uses a bootloader to pull in the remaining modules and ArcGIS modules, you will also need to update the `src/js/map/dojoBootstrap.js` file, again by updating the appVersion variable near the top of the file. After updating these values, run `npm run build` or `gulp build`.

## Application Architecture
<p>This is a multi-page application.  The homepage is pretty much the map page except it shows a dialog over the map so they are both index.jade. The remaining pages are in the src directory named after their route.</p>

<p>Each page will include the header.jade and a base.css file.  The header will be very basic with some links on it.  If you need to override the behavior of a link, do so in javascript for that page so it does not effect all the other pages.</p>

### Pages

<strong> When working on an individual page, make sure to edit the appropriate .styl file and index.jade file for that page, see table below.</strong>
<br/>
<table>
	<tr>
		<th>Page</th>
		<th>.html filename (using jade templates)</th>
		<th>.css filename (using stylus)</th>
	</tr>
	<tr>
		<td> Map/Home Page </td>
		<td> src/index.jade </td>
		<td> src/css/map.styl </td>
	</tr>
	<tr>
		<td> About Page </td>
		<td> src/about.jade </td>
		<td> src/css/about.styl </td>
	</tr>
	<tr>
		<td> Data Page </td>
		<td> src/data.jade </td>
		<td> src/css/data.styl </td>
	</tr>
	<tr>
		<td> Contact Page </td>
		<td> src/contact.jade </td>
		<td> src/css/contact.styl </td>
	</tr>
</table>
<br/>
<p>Not every page may have a need for esri or dojo code so in those cases, do not use the dojoBootstrap.js file.</p>

<strong>NOTE: Do not modify .html files, modify their .jade counterparts or else your changes will be overwritten on build.</strong>

## Configurations

#### Coming Soon
<p>We will post some examples of how to make some simple text changes to labels in the app via different config files in the project.</p>

## Git Workflow

<p>There is a develop branch which should at any given time be able to be pulled down and generate a build without any modification. When you begin working, checkout a new branch from the develop branch and only merge back in when whatever feature your on is completed.</p>
<p>When we are ready to release the application.  We should commit a new tag and name the tag as a Release-Version-X.X or something similar.  If your creating the first release you can name whatever you like but after that, every subsequent release should follow that same naming convention.  If you do not know how to tag, view <a href='http://git-scm.com/book/en/v2/Git-Basics-Tagging'>this post here</a> for details or just follow the steps below.</p>

<ol>
<li>Make sure you are on the develop branch.</li>
<li>Make sure all code is up to date and is tested and ready for release.</li>
<li>Run <code>git tag -a nameOfTag -m 'Annotation for nameOfTag'</code></li>
<li>Example: <code>git tag -a Release-1.0 -m 'Stable 1.0 version of the Global Map of Indigenous and Community Lands application.'</code></li>
</ol>

## Contribution
<p> See Git Workflow above to know how and where to commit your code.</p>
##### NOTE: DO NOT UNDER ANY CIRCUMSTANCES COMMIT ANY CREDENTIALS OF ANY KIND