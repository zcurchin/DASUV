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
      $query -> execute(); 
      $rezultat = $query -> fetchAll();

      foreach($rezultat as $r){
        $categories[] = array(
          'id' => intval($r['id']),
          'label' => $r['cat_title_'.$_GET['lang']]
        );
      }   
    echo json_encode($categories); /* return */
  }

  /* Get artist from db */
  function getArtist(){
    echo '{artist:"Balint"}';
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

    $results = json_encode($results);

    echo $results;
  }

  function getCategory(){

    $category_id = $_GET['category_id'];
    
    if(isset($category_id) && !empty($category_id)) {
      
    }

    /* vratiti po četiri od svakog: artists, artworks, texts */

    $content = array(
      'category_name' => 'Likovna umetnost',
      'artists' => array(
        array(
          'id'        => 1,
          'name' => 'Balint Sombati',
        ),
        array(
          'id'        => 2,
          'name' => 'Viktor Vazareli',
        ),
        array(
          'id'        => 3,
          'name' => 'Hundertwasser Friedensreich',
        ),
        array(
          'id'        => 4,
          'name' => 'Ištvan Balind',
        ),        
      ),
      'artworks' => array(
      ),
      'texts' => array(
      ),
    );

    $content = json_encode($content);

    echo $content;
  }

?>