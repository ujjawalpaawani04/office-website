// Facts pending confirmation from the firm. Every About page section reads
// from here so a single edit updates the whole page once real values are
// available. Leave a field null (not a bracketed placeholder) until the
// firm confirms it - every consumer below is written to omit the sentence
// or badge entirely when its value is null, rather than render a blank.
export const FIRM_INFO = {
  establishedYear: null, // e.g. 2014
  frn: null, // e.g. "012345C"
  yearsOfPractice: null, // e.g. 12
  membershipNumber: null, // e.g. "123456"
  qualifiedYear: null, // e.g. 2013
  icaiBranch: null, // e.g. "Roorkee"
  supportingTeamCount: null, // e.g. 5
  adminStaffCount: null, // e.g. 2
};

// Additional qualifications beyond B.Com, FCA - add an entry only once the
// firm confirms it is actually held (e.g. "DISA (ICAI)").
export const ADDITIONAL_QUALIFICATIONS = [];
