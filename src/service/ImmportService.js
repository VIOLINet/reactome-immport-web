import axios from "axios";

const url  = process.env.VUE_APP_IMMPORT_SERVICE;

class ImmportService {
  static fetchBiosampleMetadata() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}metadata/biosamples`)
        .then((res) => {
          resolve(this.structureJSON(res.data));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static fetchGeneExpressionAnalysis(data) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}analysis/geneExpression`, data)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // This function is used for setting up GUIs with a quick loading.
  // Make sure the Java API has set up correctly by providing the file.
  static fetchTestGeneExpressionAnalysis() {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}analysis/testGeneExpression`)
        .then((res) => {
          resolve(res.data)
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static fetchPathwayEnrichmentAnalysis(genes) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}analysis/pathways`, genes)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static fetchFINetwork(genes) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}analysis/fi_network`, genes)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static fetchClusteredFINework(cyElements){
    return new Promise((resolve, reject) => {
      axios.post(
        `${url}analysis/clustered_fi_network`,
        cyElements
      ).then((res) => {
        resolve(res.data)
      }).catch(err => {
        reject(err);
      })
    })
  }

  static structureJSON(data) {
    var rtn = [];
    const lines = data.split(/\r?\n/);
    var headers = lines.shift();
    headers = headers.split("\t");
    lines.forEach((line) => {
      const fields = line.split("\t");
      const obj = {};
      for (var i = 0; i < headers.length; i++) {
        obj[headers[i]] = fields[i];
      }
      rtn.push(obj);
    });
    return rtn;
  }
}

export default ImmportService;
