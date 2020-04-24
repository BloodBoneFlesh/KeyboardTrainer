import { Injectable } from '@angular/core';
import ru_lessons from "../assets/ru-lessons.json";
import en_lessons from "../assets/en-lessons.json";

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  constructor() { 
  }

  lessons(locale){
    if(locale == "EN")
      return en_lessons;
    return ru_lessons;
  }

  lesson(locale, name){
    for(let group in this.lessons(locale)){
      for(let lesson of this.lessons(locale)[group].exercises){
        if(lesson.name == name)
          return lesson.text;
      }
    }
    return '';
  }
}
