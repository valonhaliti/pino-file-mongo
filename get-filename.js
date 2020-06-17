module.exports = function getFilename() {
  const filenameArg = process.argv[2];
  if (filenameArg && filenameArg.startsWith('file=')) {
    return filenameArg.split('=')[1];
  } else {
    throw new Error(
      'Provide "file" argument for filename to tail, e.g.: node tail.js file=logs/app.log'
    );
  }
};
