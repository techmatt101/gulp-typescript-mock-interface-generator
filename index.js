'use strict';
const through = require('through2');
const path = require('path');
const gutil = require('gulp-util');
const TsMockInterfaceGenerator = require('typescript-mock-interface-generator');

const PluginError = gutil.PluginError;
const MODULE_NAME = 'gulp-typescript-mock-interface-generator';
const newline = new Buffer('\n');

module.exports = function () {
    return through.obj(function bufferContents(file, enc, end) {
        if (file.isNull()) {
            return end();
        }
        if (file.isStream()) {
            this.emit('error', new PluginError(MODULE_NAME, 'Streaming not supported'));
            return end();
        }

        var interfaceGenerator = new TsMockInterfaceGenerator();
        interfaceGenerator.add(file.contents);

        file.contents = Buffer.concat([
            file.contents,
            newline,
            new Buffer(interfaceGenerator.generate())
        ]);

        this.push(file);
        end();
    });
};