const usernames = [
  "arthur",
  "arthur_dent",
  "ford",
  "prefect",
  "zaphod",
  "beeblebrox",
  "trillian",
  "marvin",
  "vogon",
  "yoda",
  "luke",
  "leia",
  "hansolo",
  "chewbacca",
  "darth",
  "shadow",
  "wednesday",
  "czernobog",
  "mrnancy",
  "bilquis",
  "laura",
  "mad_sweeney",
  "coraline"
];

const generateUniqueUsername = () => {
  const timestamp = Date.now().toString();
  const name = usernames[Math.floor(Math.random() * usernames.length)];

  return `${name}${timestamp}`;
}

module.exports = generateUniqueUsername;
