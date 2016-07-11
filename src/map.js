const map = mappers => list => list.map((item, i) => mappers[i](item));

export default fn => list => map(list.map(fn));
