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

	/* getCategories() --- Get categories from db */
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
	/* getCategories() --- end */

	/* getArtist() --- Get artist from db */
	function getArtist(){
		
		$artist_id = $_GET['artist_id'];

		if(isset($artist_id) && !empty($artist_id)) {

			$lang = $_GET['lang'];

			/* artist info */
			require('init.php'); 
			$query = $db -> prepare("SELECT * FROM artists INNER JOIN categories ON artists.category_id=categories.id AND artists.artist_id=".$artist_id);
			$query -> execute(); $rezultat = $query -> fetchAll();

			foreach($rezultat as $r){
				$artist_full['artist'] = array(
					'id' => intval($r['artist_id']),
					'category_id' => intval($r['category_id']),
					'category_name' => $r['cat_title_'.$lang],
					'name' => $r['name_'.$lang],
					'website' => $r['website'],
					'biography' => $r['bio_'.$lang],
					'path' => 'avatars/'.$r['artist_id'].'.jpg'
				);
			}

			/* get artworks for artist */
			$query = $db -> prepare("SELECT * FROM artworks WHERE artist_id=".$artist_id);
			$query -> execute(); $rezultat = $query -> fetchAll();

			foreach($rezultat as $r){
				$artworks[] = array(
					'id' => intval($r['id']),
					'title' => $r['title_'.$lang],
					'year' => intval($r['year']),
					'media_type' => $r['media_type'],
					'path' => 'media/'.$r['id'].'/thumb.jpg'
				);
			}
			$artist_full['artworks'] = $artworks;

		}
		else{
			echo 'No category id specified.';
		}
		/* -> return */
		echo json_encode($artist_full);
	}
	/* getArtist() --- end */


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

	/* getCategory() --- Get artist, artworks & texts from category id */  
	function getCategory(){

		$category_id = $_GET['category_id'];
		
		if(isset($category_id) && !empty($category_id)){

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
						'id' => intval($r['artist_id']),
						'name' => $r['name_'.$_GET['lang']],
						'path' => 'avatars/'.$r['artist_id'].'.jpg'
					);
				}
				$categories['artists'] = $umetnici;

				/* get artworks */
				$query = $db -> prepare("SELECT * FROM artworks WHERE category_id=".$category_id." LIMIT 4");
				$query -> execute(); $rezultat = $query -> fetchAll();
				foreach($rezultat as $r){
					$dela[] = array(
						'id' => intval($r['id']),
						'title' => $r['title_'.$_GET['lang']],  
						'path' => 'media/'.$r['id'].'/thumb.jpg'
					);
				}
				$categories['artworks'] = $dela;

			/* -> return */
			echo json_encode($categories);
	
		}else{
			echo 'No category_id is specified.';
	}
	/* getCategory() --- end */


	/* getText() --- Get single text from text_id */
	function getText(){
	
		$text_id = $_GET['text_id'];
		$lang = $_GET['lang'];

		if(isset($text_id) && !empty($text_id)) {
 		
			$query = $db -> prepare("SELECT * FROM texts WHERE text_id=".$text_id);
			$query -> execute(); $rezultat = $query -> fetchAll();

			foreach($rezultat as $r){
				$text[] = array(
					'id' => intval($r['text_id']),
					'author' => $r['author_'.$lang],
					'title' => $r['title_'.$lang],  
					'body' => $r['body_'.$lang]
				);
			}
			/* -> return */
			echo json_encode($text);

 			}else{
 				echo 'No text_id specified.';
 			}
 	}
 	/* getText() --- end */


	/* getTexts() --- Get all texts */
	function getTexts(){

		$lang = $_GET['lang'];	
		$query = $db -> prepare("SELECT * FROM texts");
		$query -> execute(); $rezultat = $query -> fetchAll();

		foreach($rezultat as $r){
			$texts[] = array(
				'id' => intval($r['text_id']),
				'author' => $r['author_'.$lang],
				'title' => $r['title_'.$lang]
			);
		}
		/* -> return */
		echo json_encode($texts);
 	}
 	/* getTexts() --- end */




	 	/* SOON -- MORE SHIT HERE -- SOON :) */


	}
	/* end. */
?>