export interface Abbreviations {
  coords: string;
  n_label: string;
  n_type: string;
  edges: string;
  n_features: string;
  e_to: string;
  e_dir: string;
  e_weight: string;
  e_label: string;
  e_type: string;
  e_features: string;
}

export const labelKeys: Abbreviations = {
  coords: "c",
  n_label: "l",
  n_type: "x",
  n_features: "f",
  edges: "e",
  e_to: "t", // a->b
  e_dir: "d",
  e_weight: "w",
  e_label: "l",
  e_type: "y",
  e_features: "f",
};
