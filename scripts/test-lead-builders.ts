import assert from "node:assert/strict";
import {
  buildIdxLeadBody,
  buildIdxLeadNotes,
} from "../lib/idx/build-idx-lead-body";
import {
  buildLeadEmailSubject,
  buildLeadEmailText,
  getLeadEmailKind,
} from "../lib/forms/build-lead-email";

const valuation = {
  firstName: "Website",
  lastName: "Verify",
  email: "verify-forms@example.com",
  phone: "555-0100",
  message: "Home valuation request: 100 Main St, Salado, TX",
  propertyAddress: "100 Main St, Salado, TX",
};

const consultation = {
  firstName: "Website",
  lastName: "Verify",
  email: "verify-forms@example.com",
  message: "Looking for a private consultation.",
};

const listing = {
  firstName: "Website",
  lastName: "Verify",
  email: "verify-forms@example.com",
  listingId: "MLS123",
  propertyAddress: "200 Oak Ave, Belton, TX",
  message: "Interested in this listing.",
};

const valuationBody = buildIdxLeadBody(valuation);
assert.equal(valuationBody.address, valuation.propertyAddress);
assert.equal(valuationBody.notes, valuation.message);
assert.equal(valuationBody.property, undefined);
assert.equal("property" in valuationBody, false);

const consultBody = buildIdxLeadBody(consultation);
assert.equal(consultBody.address, undefined);
assert.equal(consultBody.notes, consultation.message);
assert.equal("property" in consultBody, false);

const listingBody = buildIdxLeadBody(listing);
assert.equal(listingBody.listingID, "MLS123");
assert.equal(listingBody.address, listing.propertyAddress);
assert.equal("property" in listingBody, false);

assert.equal(
  buildIdxLeadNotes("Please call", "100 Main"),
  "Please call\nProperty: 100 Main"
);
assert.equal(buildIdxLeadNotes("Has 100 Main already", "100 Main"), "Has 100 Main already");

assert.equal(getLeadEmailKind(valuation), "valuation");
assert.equal(getLeadEmailKind(consultation), "consultation");
assert.equal(getLeadEmailKind(listing), "listing");
assert.match(buildLeadEmailSubject(valuation), /Home valuation/);
assert.equal(buildLeadEmailSubject(consultation), "Private consultation request");
assert.match(buildLeadEmailSubject(listing), /Listing inquiry/);
assert.match(buildLeadEmailText(valuation), /100 Main St/);

console.log("lead builders: ok");
