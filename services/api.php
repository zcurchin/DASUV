<?php

  include('init.php');

  if(isset($_GET['method']) && !empty($_GET['method'])) {
    if(function_exists($_GET['method'])) {
      $_GET['method']();
    }
  } else {
    echo 'Method needs to be specified';
  }

  function getCategories(){

    $categories = array(
      array(
        'id' => 1,
        'label' => 'Vizuelna umetnost'
      ),
      array(
        'id' => 2,
        'label' => 'Književnost'
      ),
      array(
        'id' => 3,
        'label' => 'Muzika'
      ),
      array(
        'id' => 4,
        'label' => 'Izvođačke umetnosti'
      ),
      array(
        'id' => 5,
        'label' => 'Arhitektura i dizajn'
      ),
      array(
        'id' => 6,
        'label' => 'Film i video'
      ),
    );

    $categories = json_encode($categories);

    echo $categories;
  }

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