import { Component, OnInit } from '@angular/core';
import { LugaresService } from '../../Services/Lugares/lugares.service';
import { Lugares } from '../../Services/Lugares/lugares';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.component.html',
  styleUrl: './recomendaciones.component.css'
})
export class RecomendacionesComponent implements OnInit{

  constructor(private lugares:LugaresService){}

    todosLugars:Lugares[]=[]

    ngOnInit(): void {
      this.lugares.getTodosLugares().subscribe(lugares =>{
        this.todosLugars = lugares
      })
    }

  }