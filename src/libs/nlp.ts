import * as tfjs from "@tensorflow/tfjs";
import { LayersModel, Tensor2D } from "@tensorflow/tfjs";

type MapAny = { [key: string]: any };

export class Tokenizer {
    private filters: RegExp;
    private lower: boolean;
    private charLevel: boolean;
    private split: string;
    private oovToken: any;

    private wordIndex: MapAny;
    private wordDocs: MapAny;
    private indexWord: MapAny;
    private indexDocs: MapAny;
    private wordCounts: MapAny;

    constructor(config: any) {
        this.filters = config.filters ? RegExp(config.filters) : /[\\.,/#!$%^&*;:{}=\-_`~()]/g;
        this.lower = config.lower === 'undefined' ? true : config.lower;
        this.charLevel = config.char_level === 'undefined' ? true : config.char_level;
        this.split = config.split || " ";
        this.oovToken = config.oov_token || 0;
  
        this.wordIndex = {};
        this.wordDocs = {};
        this.indexWord = {};
        this.indexDocs = {};
        this.wordCounts = {};
      }
    
      private cleanText(text: string) {
        if (this.lower) text = text.toLowerCase();
        return text
          .replace(this.filters, '')
          .replace(/\s{2,}/g, ' ')
          .split(' ');
      }
    
      private fitOnTexts(texts: string[]) {
        texts.forEach(text => {
          const splitText = this.cleanText(text);
          splitText.forEach(word => {
            this.wordCounts[word] = (this.wordCounts[word] || 0) + 1;
          });
        });
    
        Object.entries(this.wordCounts)
          .sort((a, b) => b[1] - a[1])
          .forEach(([word, number], i) => {
            this.wordIndex[word] = i + 1;
            this.indexWord[i + 1] = word;
          });
      }
    
      public textsToSequences(texts: string[]): number[][] {
          return texts.map(text => this.cleanText(text).map(word => this.wordIndex[word] || 0));
      }
    
      public toJson() {
        return JSON.stringify({
          wordIndex: this.wordIndex,
          indexWord: this.indexWord,
          wordCounts: this.wordCounts
        })
      }
  
    public static fromSerializedJson(serializedData: string): Tokenizer {
          const data = JSON.parse(serializedData);
          const config = data["config"];
  
          const tokenizer = new Tokenizer({});
      
          tokenizer.wordCounts = JSON.parse(config['word_counts']);
          tokenizer.wordDocs = JSON.parse(config['word_docs']);
          tokenizer.wordIndex = JSON.parse(config['word_index']);
          tokenizer.indexWord = JSON.parse(config['index_word']);
          tokenizer.indexDocs = JSON.parse(config['index_docs']);
      
          return tokenizer;
    }

    public static async loadFromUrl(url: string): Promise<Tokenizer> {
        const serializedJson = await fetch(url).then(data => data.text());
        console.log();
        
        return this.fromSerializedJson(serializedJson);
    }
}

export class Helper {
    public static async loadKerasModel(url: string): Promise<LayersModel> {
        return tfjs.loadLayersModel(url);
    }

    public static generatePadSequences(sequences: number[][], max_sequence_length = 50, oov_token = 0): Tensor2D {
        const pad_sequences = sequences.map(sequence => {
            let pad_array = Array(max_sequence_length - sequence.length);
            pad_array.fill(oov_token);
            return pad_array.concat(sequence);
        });
        return tfjs.tensor2d(pad_sequences);
    }

    public static getClass(array: any): number {
        let index = 0;
        let value = array[index];
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (element > value) {
                value = element;
                index = i;
            }
        }
        return index;
    }
}

export default {
    Tokenizer,
    Helper
};