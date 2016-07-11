export default func => function () {
	return func.apply(this, arguments);
};
