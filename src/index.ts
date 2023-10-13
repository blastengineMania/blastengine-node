import crypto from "crypto";
import Transaction from "./libs/transaction";
import Bulk from "./libs/bulk";
import Usage from "./libs/usage";
import BERequest from "./libs/request";
import BEObject from "./libs/object";
import ErrorReport from "./libs/error_report";
import Mail from "./libs/mail";
import Log from "./libs/log";

/**
 * BlastEngine class is responsible for managing user authentication
 * and making authenticated requests.
 */
class BlastEngine {
  /**
   * User identifier
   * @type {string}
   */
  userId?: string;

  /**
   * API Key
   * @type {string}
   */
  apiKey?: string;

  /**
   * Token generated from user credentials
   * @type {string}
   */
  token?: string;

  /**
   * Creates a new instance of BlastEngine.
   *
   * @param {string} userId - The user identifier.
   * @param {string} apiKey - The API key.
   */
  constructor(userId: string, apiKey: string) {
    this.userId = userId;
    this.apiKey = apiKey;
    this.generateToken();
    const request = new BERequest(this.token!);
    BEObject.request = request;
  }

  /**
   * Generates a token based on the user credentials,
   * and sets the token property on the instance.
   *
   * @throws Will throw an error if userId or apiKey is not provided.
   */
  generateToken() {
    if (!this.userId) throw new Error("There is no userId");
    if (!this.apiKey) throw new Error("There is no apiKey");
    const str = `${this.userId}${this.apiKey}`;
    const hashHex = crypto
      .createHash("sha256")
      .update(str, "utf8")
      .digest("hex");
    this.token = Buffer
      .from(hashHex.toLowerCase())
      .toString("base64");
  }
}

/**
 * Exports the BlastEngine class along with other related classes and types.
 */
export {BlastEngine, Bulk, Transaction, Usage, ErrorReport, Mail, Log};
