// Example: node emptyDir dirA dirB

var emptyDirSync = require('fs-extra').emptyDirSync;
process.argv.slice(2).forEach(dir => {
	emptyDirSync(dir);
	console.log(`Emptied dir "${dir}"`);
});
