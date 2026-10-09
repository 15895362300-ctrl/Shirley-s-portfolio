// A tab session is one visit, including reloads and returns from project pages.
window.portfolioFirstVisit=false;
try{
 window.portfolioFirstVisit=!sessionStorage.getItem('portfolio-visit-started');
 if(location.hash)window.portfolioFirstVisit=false;
 sessionStorage.setItem('portfolio-visit-started','1');
}catch{window.portfolioFirstVisit=!location.hash&&!document.referrer}
if(!window.portfolioFirstVisit)document.documentElement.dataset.portfolioReturn='true';
