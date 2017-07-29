# meteor-cleaner

Clean up your Meteor package cache!

![`meteor-cleaner`](screenshot.png)

## Installation

```sh
[meteor] npm install -g meteor-cleaner
```

If you install `meteor-cleaner` globally using the `npm` version bundled with Meteor, you can run the `clean-package-cache` command like a built-in Meteor command.

## Usage

```sh
[meteor] clean-package-cache [options]
```

`clean-package-cache` analyzes the packages in `~/.meteor` and computes the amount of disk space that would be saved by removing versions according to the options explained below.
Unless you pass the `--yes` (`-y`) option, **you are asked for confirmation before anything is removed**.

After analyzing the packages, the results are stored in a cache (`~/.meteor-cleaner-cache`) that is valid for 24 hours or until versions are removed.
This means that you can quickly try out different options before you decide which versions you want to remove.
You can force `clean-package-cache` to analyze all packages again (for example, if Meteor has downloaded new packages in the meantime) using the `--ignore-cache` option or by removing the cache file.

## Options

By default, `clean-package-cache` removes all versions of each package.
Using the following options, you can specify which versions you want to keep.
If you pass more than one option, `clean-package-cache` computes the union of all matching versions.
For example, `--keep-final --keep-latest 1` removes all but the latest pre-releases.

`--keep-latest <n>`  
Keep the `n` latest versions of each package.

`--keep-scanned <path>`  
Keep versions that are used by Meteor projects in `path`.

`--keep-final`  
Keep final releases (everything that's not a pre-release).
