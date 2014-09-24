<?php

  /***************************/
  /* DASUV           api.php */
  /***************************/

  /* Check for method */
  if(isset($_GET['method']) && !empty($_GET['method'])) {
       
    if(function_exists($_GET['method'])) {
        $_GET['method']();
      }
    } else {
      echo 'Method needs to be specified';
    }

  /* Get categories from db */
  function getCategories(){
      require('init.php'); 
      $query = $db -> prepare("SELECT * FROM categories");
      $query -> execute(); $rezultat = $query -> fetchAll();

      foreach($rezultat as $r){
        $categories[] = array(
          'id' => intval($r['id']),
          'label' => $r['cat_title_'.$_GET['lang']]
        );
      }
    /* -> return */
    echo json_encode($categories);
  }

  /* Get artist from db */
  function getArtist(){
    
    $artist_id = $_GET['artist_id'];

    if(isset($artist_id) && !empty($artist_id)) {
      require('init.php'); 
      $query = $db -> prepare("SELECT * FROM artists WHERE id=".$artist_id);
      $query -> execute(); $rezultat = $query -> fetchAll();

      foreach($rezultat as $r){
        $artist[] = array(
          'id' => intval($r['id']),
          'category_id' => intval($r['category_id']),
          'name' => $r['name_'.$_GET['lang']],
          'website' => $r['website'],
          'biography' => $r['bio_'.$_GET['lang']]
        );
      }
    }
    else{
      echo 'No category id specified.';
    }
    /* -> return */
    echo json_encode($artist);
  }


  function getSearchResults(){
    $results = array(
      array(
        'id'        => 1,
        'title' => 'Some text ',
        'author'  => 'Some Author',
      ),
      array(
        'id'        => 2,
        'title' => 'Some other text',
        'author'  => 'Some Other',
      ),
    );
    
    /* -> return */
    echo json_encode($results);
  }

  /* Get artist, artworks & texts from category id */  
  function getCategory(){

    $category_id = $_GET['category_id'];
    
    if(isset($category_id) && !empty($category_id)) {

      require('init.php');

        /* get category title */
        $query = $db -> prepare("SELECT * FROM categories WHERE id=".$category_id);
        $query -> execute(); $rezultat = $query -> fetchAll();
        $categories['category_name'] = $rezultat[0]['cat_title_'.$_GET['lang']];

        /* get artists */
        $query = $db -> prepare("SELECT * FROM artists WHERE category_id=".$category_id." LIMIT 4");
        $query -> execute(); $rezultat = $query -> fetchAll();
        foreach($rezultat as $r){
          $umetnici[] = array(
            'id' => intval($r['id']),
            'name' => $r['name_'.$_GET['lang']]
          );
        }
        $categories['artists'] = $umetnici;

        /* get artworks */
        $query = $db -> prepare("SELECT * FROM artworks WHERE category_id=".$category_id." LIMIT 4");
        $query -> execute(); $rezultat = $query -> fetchAll();
        foreach($rezultat as $r){
          $dela[] = array(
            'id' => intval($r['id']),
            'title' => $r['title_'.$_GET['lang']]
          );
        }
        $categories['artworks'] = $dela;

    /* -> return */
    echo json_encode($categories);

    
    }else{
      echo 'No category id specified.';
    }
  }

?>