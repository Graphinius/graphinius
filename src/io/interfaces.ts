export interface Abbreviations {
	coords			: string;
	label				: string;
	edges				: string;
	features		: string;
	e_to				: string;
	e_dir				: string;
	e_weight		: string;
	e_label			: string;
	e_type			: string;
}


export const labelKeys: Abbreviations = {
	coords			: 'c',
	label				: 'l',
	features		: 'f',
	edges				: 'e',
	e_to				: 't', // a->b
	e_dir				: 'd',
	e_weight		: 'w',
	e_label			: 'l',
	e_type			: 'y'
};
