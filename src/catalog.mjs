/** Catalog is intentionally shared by storefront and Worker: the Worker recomputes all amounts. */
export const CATEGORIES = Object.freeze([
  {id:'electronics',label:'Tech & audio',icon:'◈',accent:'#7bbdf5',zone:[-8,-8]},
  {id:'clothing',label:'Mode & style',icon:'✦',accent:'#eaa5b0',zone:[0,-8]},
  {id:'home',label:'Maison & déco',icon:'⌂',accent:'#dcb98f',zone:[8,-8]},
  {id:'food',label:'Saveurs',icon:'◍',accent:'#a4cb97',zone:[-8,5]},
  {id:'books',label:'Culture',icon:'▤',accent:'#b1a0e7',zone:[0,5]},
  {id:'sports',label:'Sport & bien-être',icon:'◇',accent:'#89c8c0',zone:[8,5]}
]);
const products = [
 ['aurora-headphones','Casque Aurora Pro',189,'electronics','audio','Un son immersif, une silhouette sculpturale.','Nouveau',0.42],
 ['nova-phone','Smartphone Nova X',799,'electronics','phone','Écran lumineux et design sans compromis.','Best-seller',0.25],
 ['orbit-watch','Montre Orbit S',249,'electronics','watch','Votre quotidien, à portée de poignet.','',0.16],
 ['stellar-laptop','Laptop Stellar 14',1199,'electronics','laptop','Léger, précis, pensé pour créer.','',1.8],
 ['pocket-camera','Appareil photo Pixel',429,'electronics','camera','Les instants prennent une autre dimension.','',0.5],
 ['studio-jacket','Veste Studio',169,'clothing','jacket','Une coupe architecturale, un esprit libre.','Nouveau',0.9],
 ['cloud-sneakers','Sneakers Cloud',129,'clothing','shoe','Le confort qui suit tous vos mouvements.','Best-seller',0.85],
 ['essential-tee','T-shirt Essential',39,'clothing','shirt','Coton doux et lignes intemporelles.','',0.24],
 ['atelier-bag','Sac Atelier',149,'clothing','bag','L’accessoire qui vous accompagne partout.','',0.64],
 ['urban-cap','Casquette Urban',35,'clothing','cap','Le détail qui fait la différence.','',0.12],
 ['halo-lamp','Lampe Halo',139,'home','lamp','Une lumière chaude pour chaque moment.','Coup de cœur',1.3],
 ['terra-vase','Vase Terra',64,'home','vase','Céramique organique et lignes naturelles.','',1.1],
 ['nord-chair','Fauteuil Nord',329,'home','chair','Une pause design au cœur de votre intérieur.','',7.5],
 ['linen-candle','Bougie Linen',28,'home','candle','Un parfum calme, doux et enveloppant.','',0.4],
 ['arc-clock','Horloge Arc',89,'home','clock','Le temps comme objet de décoration.','',0.8],
 ['origin-coffee','Café Origin',18,'food','coffee','Grains d’exception, torréfaction lente.','Bio',0.5],
 ['cacao-box','Coffret Cacao',24,'food','chocolate','Chocolats fins pour les curieux.','',0.35],
 ['matcha-ritual','Matcha Ritual',32,'food','matcha','Un rituel vert, tout en douceur.','Bio',0.22],
 ['olive-reserve','Huile Olive Réserve',29,'food','bottle','Une sélection gastronomique de caractère.','',0.75],
 ['tea-collection','Collection Thés',22,'food','tea','Six découvertes à infuser lentement.','',0.3],
 ['design-atlas','Atlas du Design',49,'books','book','Les idées qui ont dessiné le monde.','Coup de cœur',0.9],
 ['cosmos-book','Voyage dans le Cosmos',34,'books','book','Une exploration illustrée de l’infini.','',0.7],
 ['architecture-now','Architecture Now',59,'books','book','De nouveaux espaces à imaginer.','',1.1],
 ['creative-journal','Carnet Créatif',19,'books','journal','Des pages vierges pour vos inspirations.','',0.35],
 ['coffee-stories','Histoires de Café',27,'books','book','Voyage aux origines de notre boisson préférée.','',0.5],
 ['flow-mat','Tapis Flow',59,'sports','yoga','Votre espace personnel pour ralentir.','Best-seller',1.4],
 ['pulse-bottle','Gourde Pulse',35,'sports','bottle','Hydratation sans compromis, partout.','',0.28],
 ['core-dumbbells','Haltères Core',79,'sports','dumbbell','Un essentiel pour progresser chez soi.','',5.0],
 ['motion-ball','Ballon Motion',39,'sports','ball','Le plaisir du jeu, à chaque rebond.','',0.5],
 ['stride-bag','Sac Stride',89,'sports','bag','Tout votre équipement, prêt à partir.','',0.66]
];
export const PRODUCTS = Object.freeze(products.map(([id,name,price,category,shape,description,badge,weight],index)=>Object.freeze({id,name,priceCents:Math.round(price*100),category,shape,description,badge,weight,featured:index===0||index===6||index===10||index===20})));
export const PRODUCT_BY_ID = Object.freeze(Object.fromEntries(PRODUCTS.map(p=>[p.id,p])));
export const categoryFor = id => CATEGORIES.find(x=>x.id===id);
