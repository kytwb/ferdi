/* eslint max-len: 0 */
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import csso from 'gulp-csso';
import terser from 'terser';
import composer from 'gulp-uglify/composer';
import htmlMin from 'gulp-htmlmin';
import server from 'gulp-server-livereload';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import sassVariables from 'gulp-sass-variables';
import { moveSync, removeSync } from 'fs-extra';
import kebabCase from 'kebab-case';
import hexRgb from 'hex-rgb';
import path from 'path';

import config from './package.json';

import * as rawStyleConfig from './src/theme/default/legacy.js';

dotenv.config();

const uglify = composer(terser, console);

const styleConfig = Object.keys(rawStyleConfig).map((key) => {
  const isHex = /^#[0-9A-F]{6}$/i.test(rawStyleConfig[key]);
  return {
    [`$raw_${kebabCase(key)}`]: isHex
      ? hexRgb(rawStyleConfig[key], { format: 'array' })
        .splice(0, 3)
        .join(',')
      : rawStyleConfig[key],
  };
});

const paths = {
  src: 'src',
  dest: 'build',
  tmp: '.tmp',
  package: `out/${config.version}`,
  recipes: {
    src: 'recipes/archives/*.tar.gz',
    dest: 'build/recipes/',
  },
  recipeInfo: {
    src: 'recipes/*.json',
    dest: 'build/recipes/',
  },
  extensionInfo: {
    src: 'extensions/*.json',
    dest: 'build/extensions/',
  },
  html: {
    src: 'src/**/*.html',
    dest: 'build/',
    watch: 'src/**/*.html',
  },
  styles: {
    src: 'src/styles/main.scss',
    dest: 'build/styles',
    watch: 'src/styles/**/*.scss',
  },
  scripts: {
    src: 'src/**/*.js',
    dest: 'build/',
    watch: [
      // 'packages/**/*.js',
      'src/**/*.js',
    ],
  },
  packages: {
    watch: 'packages/**/*',
    // dest: 'build/',
    // watch: [
    //   // 'packages/**/*.js',
    //   'src/**/*.js',
    // ],
  },
};

function _shell(cmd, cb) {
  console.log('executing', cmd);
  exec(
    cmd,
    {
      cwd: paths.dest,
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

      cb();
    },
  );
}

const clean = (done) => {
  removeSync(paths.tmp);
  removeSync(paths.dest);

  done();
};
export { clean };

export function mvSrc() {
  return gulp
    .src(
      [
        `${paths.src}/*`,
        `${paths.src}/*/**`,
        `!${paths.scripts.watch[1]}`,
        `!${paths.src}/styles/**`,
        `!${paths.src}/**/*.js`,
      ],
      { since: gulp.lastRun(mvSrc) },
    )
    .pipe(gulp.dest(paths.dest));
}

export function mvPackageJson() {
  return gulp.src(['./package.json']).pipe(gulp.dest(paths.dest));
}

export function mvLernaPackages() {
  return gulp.src(['packages/**']).pipe(gulp.dest(`${paths.dest}/packages`));
}

export function html() {
  return gulp
    .src(paths.html.src, { since: gulp.lastRun(html) })
    .pipe(gulpIf(process.env.NODE_ENV !== 'development', htmlMin({ // Only minify in production to speed up dev builds
      collapseWhitespace: true,
      removeComments: true
    })))
    .pipe(gulp.dest(paths.html.dest));
}

export function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(
      sassVariables(
        Object.assign(
          {
            $env:
              process.env.NODE_ENV === 'development'
                ? 'development'
                : 'production',
          },
          ...styleConfig,
        ),
      ),
    )
    .pipe(
      sass({
        includePaths: ['./node_modules', '../node_modules'],
      }).on('error', sass.logError),
    )
    .pipe((gulpIf(process.env.NODE_ENV !== 'development', csso({ // Only minify in production to speed up dev builds
      restructure: false, // Don't restructure CSS, otherwise it will break the styles
    }))))
    .pipe(gulp.dest(paths.styles.dest));
}

export function scripts() {
  return gulp
    .src(paths.scripts.src, { since: gulp.lastRun(scripts) })
    .pipe(
      babel({
        comments: false,
      }),
    )
    .pipe(gulpIf(process.env.NODE_ENV !== 'development', uglify())) // Only uglify in production to speed up dev builds
    .pipe(gulp.dest(paths.scripts.dest));
}

export function watch() {
  gulp.watch(paths.packages.watch, mvLernaPackages);
  gulp.watch(paths.styles.watch, styles);

  gulp.watch([paths.src, `${paths.scripts.src}`, `${paths.styles.src}`], mvSrc);

  gulp.watch(paths.scripts.watch, scripts);
}

export function webserver() {
  gulp.src([paths.dest]).pipe(
    server({
      livereload: true,
    }),
  );
}

export function recipes() {
  return gulp.src(paths.recipes.src, { since: gulp.lastRun(recipes) })
    .pipe(gulp.dest(paths.recipes.dest));
}
export function recipeInfo() {
  return gulp.src(paths.recipeInfo.src, { since: gulp.lastRun(recipeInfo) })
    .pipe(gulp.dest(paths.recipeInfo.dest));
}
export function extensionInfo() {
  return gulp.src(paths.extensionInfo.src, { since: gulp.lastRun(extensionInfo) })
    .pipe(gulp.dest(paths.extensionInfo.dest));
}

const build = gulp.series(
  clean,
  gulp.parallel(mvSrc, mvPackageJson, mvLernaPackages),
  gulp.parallel(html, scripts, styles, recipes, recipeInfo, extensionInfo),
);
export { build };

const dev = gulp.series(build, gulp.parallel(webserver, watch));
export { dev };
