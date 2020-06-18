import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  public token: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    ) { }


  ngOnInit() {
    this.route.queryParams.subscribe(qp => {
      this.token = qp['token'];

      if(this.token) {
        localStorage.setItem('bh_secure', JSON.stringify({user: 'demo', token: this.token}));
        setTimeout(()=> this.router.navigate(['admin']),3000);
      }
    });
  }

}
