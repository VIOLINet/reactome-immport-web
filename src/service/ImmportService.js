import axios from "axios";

class ImmportService {
  static fetchBiosampleMetadata() {
    return new Promise((resolve, reject) => {
      axios
        .get("http://localhost:8076/immportws/metadata/biosamples")
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
        .post("http://localhost:8076/immportws/analysis/geneExpression", data)
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
        .post("http://localhost:8076/immportws/analysis/pathways", genes)
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
        .post("http://localhost:8076/immportws/analysis/fi_network", genes)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
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
