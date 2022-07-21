/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Example jscodeshift transformer. Simply reverses the names of all
 * identifiers.
 */
module.exports = function (file, api) {
  const j = api.jscodeshift;

  return j(file.source)
    .find(j.Identifier)
    .replaceWith(p => j.identifier(p.node.name.split("").reverse().join("")))
    .toSource();
};

// module.exports = transformer;

// module.exports = function (fileInfo, api, options) {
//   // transform `fileInfo.source` here
//   // ...
//   // return changed source
//   return fileInfo.source;
// };
