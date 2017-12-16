const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;

const cur_dir = ".",
      dist_dir = "dist",
      dist_links_lock = "distlinks.lock";

if ( fs.existsSync( path.join( cur_dir, dist_links_lock ) ) ) {
  fs.readdirSync(dist_dir).forEach( function(dir) {
    ncp(path.join(dist_dir, dir), path.join(cur_dir, dir), function (err) {
      if (err) {
        return console.error(err);
      }
      console.log(`Copied dist directory "${dir}" to root...`);
     });
  });  
}
