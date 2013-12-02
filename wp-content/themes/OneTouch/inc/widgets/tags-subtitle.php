<?php

class crum_tags_subtitle extends WP_Widget {

	function crum_tags_subtitle(  ) {

		/* Widget settings. */

		$widget_ops = array( 'classname' => 'tags-widget', 'description' => __( 'Tags block with subtitle','theory') );

		/* Widget control settings. */

		$control_ops = array( 'id_base' => 'crum_tags_subtitle' );

		/* Create the widget. */

		$this->WP_Widget( 'crum_tags_subtitle', 'Theme: Tags block with subtitle', $widget_ops, $control_ops );

	}

	function widget( $args, $instance ) {

		//get theme options

        if ( isset( $instance[ 'title' ] ) ) {

            $title = $instance[ 'title' ];

        } else {

            $title = __( 'Text block', 'roots' );

        }
        if ( isset( $instance[ 'subtitle' ] ) ) {

            $subtitle = $instance[ 'subtitle' ];
        }

		extract( $args );

		/* show the widget content without any headers or wrappers */

        echo $before_widget;

        if ( $subtitle ) {
            echo '<div class="subtitle">';
            echo $subtitle;
            echo '</div>';
        }

        if ( ! empty( $title ) )

            echo $before_title . $title . $after_title; ?>

        <?php wp_tag_cloud('smallest=10&largest=20&number=50'); ?>

    <?php echo $after_widget;
    }

	function update( $new_instance, $old_instance ) {

		$instance = $old_instance;

        $instance['title'] = strip_tags( $new_instance['title'] );

        $instance['subtitle'] = strip_tags( $new_instance['subtitle'] );

		return $instance;

	}

	function form( $instance ) {

        $title = apply_filters( 'widget_title', $instance['title'] );

        $subtitle = $instance['subtitle'];

		/* Set up some default widget settings. */

		$instance = wp_parse_args( (array) $instance, $defaults ); ?>

    <p>
      <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label>
      <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo esc_attr($title); ?>"/>
    </p>
    <p>
      <label for="<?php echo $this->get_field_id('subtitle'); ?>"><?php _e('Subtitle:'); ?></label>
      <input class="widefat" id="<?php echo $this->get_field_id('subtitle'); ?>" name="<?php echo $this->get_field_name('subtitle'); ?>" type="text" value="<?php echo esc_attr($subtitle); ?>"/>
    </p>

        <?php

	}

}