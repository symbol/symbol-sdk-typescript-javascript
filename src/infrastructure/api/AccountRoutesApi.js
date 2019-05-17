/*
 * Copyright 2019 NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Catapult REST API Reference
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 1.0.12
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */


import {ApiClient} from "../ApiClient";
import AccountInfoDTO from '../model/AccountInfoDTO';
import AccountPropertiesInfoDTO from '../model/AccountPropertiesInfoDTO';
import MultisigAccountGraphInfoDTO from '../model/MultisigAccountGraphInfoDTO';
import MultisigAccountInfoDTO from '../model/MultisigAccountInfoDTO';

/**
* AccountRoutes service.
* @module api/AccountRoutesApi
* @version 1.0.12
*/
export  class AccountRoutesApi {

    /**
    * Constructs a new AccountRoutesApi.
    * @alias module:api/AccountRoutesApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }



    /**
     * Get account information
     * Returns the account information.
     * @param {String} accountId The public key or address of the account.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/AccountInfoDTO} and HTTP response
     */
    getAccountInfoWithHttpInfo(accountId) {
      let postBody = null;

      // verify the required parameter 'accountId' is set
      if (accountId === undefined || accountId === null) {
        throw new Error("Missing the required parameter 'accountId' when calling getAccountInfo");
      }


      let pathParams = {
        'accountId': accountId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = AccountInfoDTO;

      return this.apiClient.callApi(
        '/account/{accountId}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get account information
     * Returns the account information.
     * @param {String} accountId The public key or address of the account.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/AccountInfoDTO}
     */
    getAccountInfo(accountId) {
      return this.getAccountInfoWithHttpInfo(accountId)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get multisig account information
     * Returns the [multisig account](https://nemtech.github.io/concepts/multisig-account.html) information.
     * @param {String} accountId The public key or address of the account.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/MultisigAccountInfoDTO} and HTTP response
     */
    getAccountMultisigWithHttpInfo(accountId) {
      let postBody = null;

      // verify the required parameter 'accountId' is set
      if (accountId === undefined || accountId === null) {
        throw new Error("Missing the required parameter 'accountId' when calling getAccountMultisig");
      }


      let pathParams = {
        'accountId': accountId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = MultisigAccountInfoDTO;

      return this.apiClient.callApi(
        '/account/{accountId}/multisig', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get multisig account information
     * Returns the [multisig account](https://nemtech.github.io/concepts/multisig-account.html) information.
     * @param {String} accountId The public key or address of the account.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/MultisigAccountInfoDTO}
     */
    getAccountMultisig(accountId) {
      return this.getAccountMultisigWithHttpInfo(accountId)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get multisig account graph information
     * Returns the [multisig account](https://nemtech.github.io/concepts/multisig-account.html) graph.
     * @param {String} accountId The public key or address of the account.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<module:model/MultisigAccountGraphInfoDTO>} and HTTP response
     */
    getAccountMultisigGraphWithHttpInfo(accountId) {
      let postBody = null;

      // verify the required parameter 'accountId' is set
      if (accountId === undefined || accountId === null) {
        throw new Error("Missing the required parameter 'accountId' when calling getAccountMultisigGraph");
      }


      let pathParams = {
        'accountId': accountId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [MultisigAccountGraphInfoDTO];

      return this.apiClient.callApi(
        '/account/{accountId}/multisig/graph', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get multisig account graph information
     * Returns the [multisig account](https://nemtech.github.io/concepts/multisig-account.html) graph.
     * @param {String} accountId The public key or address of the account.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<module:model/MultisigAccountGraphInfoDTO>}
     */
    getAccountMultisigGraph(accountId) {
      return this.getAccountMultisigGraphWithHttpInfo(accountId)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get account configurable properties information
     * Returns the [configurable properties](https://nemtech.github.io/concepts/account-filter.html) for a given account.
     * @param {String} accountId The public key or address of the account.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/AccountPropertiesInfoDTO} and HTTP response
     */
    getAccountPropertiesWithHttpInfo(accountId) {
      let postBody = null;

      // verify the required parameter 'accountId' is set
      if (accountId === undefined || accountId === null) {
        throw new Error("Missing the required parameter 'accountId' when calling getAccountProperties");
      }


      let pathParams = {
        'accountId': accountId
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = AccountPropertiesInfoDTO;

      return this.apiClient.callApi(
        '/account/properties/{accountId}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get account configurable properties information
     * Returns the [configurable properties](https://nemtech.github.io/concepts/account-filter.html) for a given account.
     * @param {String} accountId The public key or address of the account.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/AccountPropertiesInfoDTO}
     */
    getAccountProperties(accountId) {
      return this.getAccountPropertiesWithHttpInfo(accountId)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get account properties for given array of addresses
     * Returns the [configurable properties](https://nemtech.github.io/concepts/account-filter.html) for a given array of addresses.
     * @param {module:model/Addresses} addresses An array of addresses.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<module:model/AccountPropertiesInfoDTO>} and HTTP response
     */
    getAccountPropertiesFromAccountsWithHttpInfo(addresses) {
      let postBody = addresses;

      // verify the required parameter 'addresses' is set
      if (addresses === undefined || addresses === null) {
        throw new Error("Missing the required parameter 'addresses' when calling getAccountPropertiesFromAccounts");
      }


      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [AccountPropertiesInfoDTO];

      return this.apiClient.callApi(
        '/account/properties', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get account properties for given array of addresses
     * Returns the [configurable properties](https://nemtech.github.io/concepts/account-filter.html) for a given array of addresses.
     * @param {module:model/Addresses} addresses An array of addresses.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<module:model/AccountPropertiesInfoDTO>}
     */
    getAccountPropertiesFromAccounts(addresses) {
      return this.getAccountPropertiesFromAccountsWithHttpInfo(addresses)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get accounts information
     * Returns the account information for an array of accounts.
     * @param {module:model/Addresses} addresses An array of addresses.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<module:model/AccountInfoDTO>} and HTTP response
     */
    getAccountsInfoWithHttpInfo(addresses) {
      let postBody = addresses;

      // verify the required parameter 'addresses' is set
      if (addresses === undefined || addresses === null) {
        throw new Error("Missing the required parameter 'addresses' when calling getAccountsInfo");
      }


      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [AccountInfoDTO];

      return this.apiClient.callApi(
        '/account', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get accounts information
     * Returns the account information for an array of accounts.
     * @param {module:model/Addresses} addresses An array of addresses.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<module:model/AccountInfoDTO>}
     */
    getAccountsInfo(addresses) {
      return this.getAccountsInfoWithHttpInfo(addresses)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get incoming transactions
     * Gets an array of incoming transactions. A transaction is said to be incoming with respect to an account if the account is the recipient of the transaction.
     * @param {String} publicKey The public key of the account.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageSize The number of transactions to return for each request. (default to 10)
     * @param {String} opts.id The transaction id up to which transactions are returned.
     * @param {String} opts.ordering The ordering criteria. * -id: Descending order by id. * id: Ascending order by id.  (default to -id)
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<Object>} and HTTP response
     */
    incomingTransactionsWithHttpInfo(publicKey, opts) {
      opts = opts || {};
      let postBody = null;

      // verify the required parameter 'publicKey' is set
      if (publicKey === undefined || publicKey === null) {
        throw new Error("Missing the required parameter 'publicKey' when calling incomingTransactions");
      }


      let pathParams = {
        'publicKey': publicKey
      };
      let queryParams = {
        'pageSize': opts['pageSize'],
        'id': opts['id'],
        'ordering': opts['ordering']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [Object];

      return this.apiClient.callApi(
        '/account/{publicKey}/transactions/incoming', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get incoming transactions
     * Gets an array of incoming transactions. A transaction is said to be incoming with respect to an account if the account is the recipient of the transaction.
     * @param {String} publicKey The public key of the account.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageSize The number of transactions to return for each request. (default to 10)
     * @param {String} opts.id The transaction id up to which transactions are returned.
     * @param {String} opts.ordering The ordering criteria. * -id: Descending order by id. * id: Ascending order by id.  (default to -id)
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<Object>}
     */
    incomingTransactions(publicKey, opts) {
      return this.incomingTransactionsWithHttpInfo(publicKey, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get outgoing transactions
     * Gets an array of outgoing transactions. A transaction is said to be outgoing with respect to an account if the account is the sender of the transaction.
     * @param {String} publicKey The public key of the account.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageSize The number of transactions to return for each request. (default to 10)
     * @param {String} opts.id The transaction id up to which transactions are returned.
     * @param {String} opts.ordering The ordering criteria. * -id: Descending order by id. * id: Ascending order by id.  (default to -id)
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<Object>} and HTTP response
     */
    outgoingTransactionsWithHttpInfo(publicKey, opts) {
      opts = opts || {};
      let postBody = null;

      // verify the required parameter 'publicKey' is set
      if (publicKey === undefined || publicKey === null) {
        throw new Error("Missing the required parameter 'publicKey' when calling outgoingTransactions");
      }


      let pathParams = {
        'publicKey': publicKey
      };
      let queryParams = {
        'pageSize': opts['pageSize'],
        'id': opts['id'],
        'ordering': opts['ordering']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [Object];

      return this.apiClient.callApi(
        '/account/{publicKey}/transactions/outgoing', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get outgoing transactions
     * Gets an array of outgoing transactions. A transaction is said to be outgoing with respect to an account if the account is the sender of the transaction.
     * @param {String} publicKey The public key of the account.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageSize The number of transactions to return for each request. (default to 10)
     * @param {String} opts.id The transaction id up to which transactions are returned.
     * @param {String} opts.ordering The ordering criteria. * -id: Descending order by id. * id: Ascending order by id.  (default to -id)
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<Object>}
     */
    outgoingTransactions(publicKey, opts) {
      return this.outgoingTransactionsWithHttpInfo(publicKey, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get aggregate bonded transactions information
     * Gets an array of [aggregate bonded transactions](https://nemtech.github.io/concepts/aggregate-transaction.html) where the account is the sender or requires to cosign the transaction.
     * @param {String} publicKey The public key of the account.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageSize The number of transactions to return for each request. (default to 10)
     * @param {String} opts.id The transaction id up to which transactions are returned.
     * @param {String} opts.ordering The ordering criteria. * -id: Descending order by id. * id: Ascending order by id.  (default to -id)
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<Object>} and HTTP response
     */
    partialTransactionsWithHttpInfo(publicKey, opts) {
      opts = opts || {};
      let postBody = null;

      // verify the required parameter 'publicKey' is set
      if (publicKey === undefined || publicKey === null) {
        throw new Error("Missing the required parameter 'publicKey' when calling partialTransactions");
      }


      let pathParams = {
        'publicKey': publicKey
      };
      let queryParams = {
        'pageSize': opts['pageSize'],
        'id': opts['id'],
        'ordering': opts['ordering']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [Object];

      return this.apiClient.callApi(
        '/account/{publicKey}/transactions/partial', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get aggregate bonded transactions information
     * Gets an array of [aggregate bonded transactions](https://nemtech.github.io/concepts/aggregate-transaction.html) where the account is the sender or requires to cosign the transaction.
     * @param {String} publicKey The public key of the account.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageSize The number of transactions to return for each request. (default to 10)
     * @param {String} opts.id The transaction id up to which transactions are returned.
     * @param {String} opts.ordering The ordering criteria. * -id: Descending order by id. * id: Ascending order by id.  (default to -id)
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<Object>}
     */
    partialTransactions(publicKey, opts) {
      return this.partialTransactionsWithHttpInfo(publicKey, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get confirmed transactions
     * Gets an array of transactions for which an account is the sender or receiver.
     * @param {String} publicKey The public key of the account.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageSize The number of transactions to return for each request. (default to 10)
     * @param {String} opts.id The transaction id up to which transactions are returned.
     * @param {String} opts.ordering The ordering criteria. * -id: Descending order by id. * id: Ascending order by id.  (default to -id)
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<Object>} and HTTP response
     */
    transactionsWithHttpInfo(publicKey, opts) {
      opts = opts || {};
      let postBody = null;

      // verify the required parameter 'publicKey' is set
      if (publicKey === undefined || publicKey === null) {
        throw new Error("Missing the required parameter 'publicKey' when calling transactions");
      }


      let pathParams = {
        'publicKey': publicKey
      };
      let queryParams = {
        'pageSize': opts['pageSize'],
        'id': opts['id'],
        'ordering': opts['ordering']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [Object];

      return this.apiClient.callApi(
        '/account/{publicKey}/transactions', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get confirmed transactions
     * Gets an array of transactions for which an account is the sender or receiver.
     * @param {String} publicKey The public key of the account.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageSize The number of transactions to return for each request. (default to 10)
     * @param {String} opts.id The transaction id up to which transactions are returned.
     * @param {String} opts.ordering The ordering criteria. * -id: Descending order by id. * id: Ascending order by id.  (default to -id)
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<Object>}
     */
    transactions(publicKey, opts) {
      return this.transactionsWithHttpInfo(publicKey, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


    /**
     * Get unconfirmed transactions
     * Gets the array of transactions not included in a block where an account is the sender or receiver.
     * @param {String} publicKey The public key of the account.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageSize The number of transactions to return for each request. (default to 10)
     * @param {String} opts.id The transaction id up to which transactions are returned.
     * @param {String} opts.ordering The ordering criteria. * -id: Descending order by id. * id: Ascending order by id.  (default to -id)
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<Object>} and HTTP response
     */
    unconfirmedTransactionsWithHttpInfo(publicKey, opts) {
      opts = opts || {};
      let postBody = null;

      // verify the required parameter 'publicKey' is set
      if (publicKey === undefined || publicKey === null) {
        throw new Error("Missing the required parameter 'publicKey' when calling unconfirmedTransactions");
      }


      let pathParams = {
        'publicKey': publicKey
      };
      let queryParams = {
        'pageSize': opts['pageSize'],
        'id': opts['id'],
        'ordering': opts['ordering']
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = [];
      let accepts = ['application/json'];
      let returnType = [Object];

      return this.apiClient.callApi(
        '/account/{publicKey}/transactions/unconfirmed', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType
      );
    }

    /**
     * Get unconfirmed transactions
     * Gets the array of transactions not included in a block where an account is the sender or receiver.
     * @param {String} publicKey The public key of the account.
     * @param {Object} opts Optional parameters
     * @param {Number} opts.pageSize The number of transactions to return for each request. (default to 10)
     * @param {String} opts.id The transaction id up to which transactions are returned.
     * @param {String} opts.ordering The ordering criteria. * -id: Descending order by id. * id: Ascending order by id.  (default to -id)
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<Object>}
     */
    unconfirmedTransactions(publicKey, opts) {
      return this.unconfirmedTransactionsWithHttpInfo(publicKey, opts)
        .then(function(response_and_data) {
          return response_and_data.data;
        });
    }


}
