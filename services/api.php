<?php

	/***************************/
	/* DASUV           api.php */
	/***************************/

	/* Check for method */
	if(isset($_GET['method']) && !empty($_GET['method'])) {

		if(function_exists($_GET['method'])){
			$_GET['method']();
		}
		else{
			echo 'Method needs to be specified';
		}
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
					'id' => intval($r['artwork_id']),
					'title' => $r['title_'.$lang],
					'year' => intval($r['year']),
					'media_type' => $r['media_type'],
					'path' => 'media/'.$r['artwork_id'].'/thumb.jpg'
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


	/* getSearchResults() --- Get artists, artworks & texts for given keyword */
	function getSearchResults(){

		require 'init.php';
		$lang = $_GET['lang'];
		$keyword = $_GET['keyword'];

		if(isset($keyword) && !empty($keyword)) {

			/* Get two Artists for given keyword */
			$query = $db -> prepare("SELECT * FROM artists WHERE
				name_sr LIKE '%".$keyword."%'
				OR name_en LIKE '%".$keyword."%'
				LIMIT 2");
			$query -> execute(); $rezultat = $query -> fetchAll();

			foreach($rezultat as $r){
				$art_get[] = array(
					'id' => intval($r['artist_id']),
					'name' => $r['name_'.$lang]
				);
			}
			$result['artists'] = $art_get;


			/* Get two Artworks for given keyword, but exclude texts */
			$query = $db -> prepare("SELECT * FROM artworks INNER JOIN artists ON artworks.artist_id=artists.artist_id WHERE
				media_type != 'text' AND
				(title_sr LIKE '%".$keyword."%'
				OR title_en LIKE '%".$keyword."%'
				OR year LIKE '%".$keyword."%'
				OR publisher LIKE '%".$keyword."%')
				LIMIT 2");
			$query -> execute(); $rezultat = $query -> fetchAll();

			foreach($rezultat as $r){
				$artw_get[] = array(
					'id' => intval($r['artwork_id']),
					'author' => $r['name_'.$lang],
					'title' => $r['title_'.$lang]
				);
			}
			$result['artworks'] = $artw_get;


			/* Get two Texts for given keyword */
			$query = $db -> prepare("SELECT * FROM artworks INNER JOIN artists ON artworks.artist_id=artists.artist_id WHERE
				media_type = 'text' AND
				(title_sr LIKE '%".$keyword."%'
				OR title_en LIKE '%".$keyword."%'
				OR year LIKE '%".$keyword."%'
				OR publisher LIKE '%".$keyword."%')
				LIMIT 2");
			$query -> execute(); $rezultat = $query -> fetchAll();

			foreach($rezultat as $r){
				$artt_get[] = array(
					'id' => intval($r['artwork_id']),
					'author' => $r['name_'.$lang],
					'title' => $r['title_'.$lang]
				);
			}
			$result['texts'] = $artt_get;

		}
		else{
			echo 'No keyword specified.';
		}

		/* -> return */
		echo json_encode($result);

	}
	/* getSearchResults() --- end */


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
						'id' => intval($r['artwork_id']),
						'title' => $r['title_'.$_GET['lang']],
						'path' => 'media/'.$r['artwork_id'].'/thumb.jpg'
					);
				}
				$categories['artworks'] = $dela;

		}
		else{
			echo 'No category_id is specified.';
		}
	/* -> return */
	echo json_encode($categories);
	}
	/* getCategory() --- end */


	/* getOneText() --- Get single text from text_id */
	function getOneText(){

		require('init.php');
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
 		}
 		else{
 			echo 'No text_id specified.';
 		}
 		/* -> return */
		echo json_encode($text);
 	}
 	/* getOneText() --- end */


	/* getTexts() --- Get all texts */
	function getTexts(){

		require('init.php');
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

	/* getArtwork() --- Get artwork for specific id */
	function getArtwork(){

		$lang = $_GET['lang'];
		$artwork_id = $_GET['artwork_id'];

		$query = $db -> prepare(
		"SELECT * FROM artworks
		INNER JOIN categories ON
		artworks.category_id=categories.id
		INNER JOIN artists ON
		artworks.artist_id=artists.artist_id
		WHERE artwork_id LIKE ".$artwork_id."
		");

		$query -> execute(); $rezultat = $query -> fetchAll();

		foreach($rezultat as $r){
			$artwork['artwork'] = array(
				'id' => intval($r['artwork_id']),
				'artist_id' => intval($r['artist_id']),
				'artist_name' => $r['name_'.$lang],
				'category_id' => intval($r['category_id']),
				'category_name' => $r['cat_title_'.$lang],
				'title' => $r['title_'.$lang],
				'year' => $r['year'],
				'medium' => $r['medium_'.$lang],
				'field' => $r['field_'.$lang],
				'technique' => $r['technique_'.$lang],
				'format' => $r['format_'.$lang],
				'genre' => $r['genre_'.$lang],
				'volume' => $r['volume'],
				'publisher' => $r['publisher'],
				'isbn' => $r['isbn'],
				'production' => $r['production'],
				'dimensions' => $r['dimensions'],
				'runtime' => $r['runtime'],
				'media_type' => $r['media_type'],
				'files' => count(glob("../media/".$artwork_id."/[0-9]*\.jpg"))
			);
		}

		echo json_encode($artwork);
	}
	/* getArtwork() --- end */


	/* SOON -- MORE SHIT HERE -- SOON :) */


/* end. */?>
