import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({providedIn: 'root'})
export class GifsService {

    public gifList: Gif[] = [];

    private _tagsHistory: string[] = []
    private apiKey: string = "WTVWNqgabCcbT3psMb4b4O7HGDMa1Nw8"
    private serviceUrl: string = "http://api.giphy.com/v1/gifs"


    constructor(private http: HttpClient){
        this.loadLocaleStorage();
        console.log('Gifs Service')
        if (this._tagsHistory.length === 0) return;
        this.searchTag(this._tagsHistory[0]);
    }
    
    get tagsHistory(){
        return[...this._tagsHistory]
    }

    private organizeHistory( tag: string ){
        tag = tag.toLocaleLowerCase()

        if (this._tagsHistory.includes(tag)) {
            this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag)
        }
        this._tagsHistory.unshift( tag );
        this._tagsHistory = this._tagsHistory;
        this.saveLocalStorage();
    }

    private saveLocalStorage(){
        localStorage.setItem('history', JSON.stringify(this._tagsHistory));
    }

    private loadLocaleStorage():void {
        if ( !localStorage.getItem('history')) {
            return;
        }
        this._tagsHistory = JSON.parse( localStorage.getItem('history')! );

    }

    async searchTag( tag: string ):Promise<void>{
        if (tag.length === 0) {
            return;
        }
        this.organizeHistory( tag );

        const params = new HttpParams()
        .set('api_key', this.apiKey)
        .set('limit',10)
        .set('q', tag);

        this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params })
        .subscribe( resp => {
            this.gifList = resp.data;
            console.log(resp.data);
        });

        // fetch("http://api.giphy.com/v1/gifs/search?api_key=WTVWNqgabCcbT3psMb4b4O7HGDMa1Nw8&q=valorant&limit=10")
        // .then( resp => resp.json() )
        // .then( data => console.log(data))

    }
}