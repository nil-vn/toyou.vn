<?php

class crum_latest_tweets extends WP_Widget
{
    public function __construct()
    {
        $widget_ops  = array('classname' => 'twitter-widget', 'description' => __('Displays your latest Tweets', 'crum'));
        $control_ops = array('width' => 200, 'height' => 350, 'id_base' => 'crum_latest_tweets');
        $this->WP_Widget('crum_latest_tweets', 'Theme: Latest Tweets', $widget_ops, $control_ops);
    }

    public function widget($args, $instance)
    {
        extract($args);

        $title    = $instance['title'];
        $subtitle = $instance['subtitle'];
        $num      = $instance['num'];
        $username = $instance['username'];
        $refresh  = $instance['refresh'];

        if (empty($username))
            $username = "Crumina";

        echo $before_widget;

        if ($subtitle)
            echo '<div class="subtitle">' . $subtitle . '</div>';

        if ($title)
            echo $before_title . $title . $after_title;

        $cached_tweets = get_transient('crumina_latest_tweets');

        //if not cached
        if (false === $cached_tweets || $cached_tweets['tweets_posts'] != $num || $cached_tweets['tweets_cahe_time'] != (int)$refresh)
        {
            $twitter_url = 'http://api.twitter.com/1/statuses/user_timeline.json?&screen_name=' . $username . '&count=' . $num;
            $response    = wp_remote_get($twitter_url);	
            if (!is_wp_error($response))
            {
                $tweets = json_decode($response['body'], true);

                //if twitter return error
                if(isset($tweets['error']))
                {
                    _e('Rate limit exceeded. Clients may not make more than 150 requests per hour','crum');
                }
                elseif(isset($tweets['errors']))
                {
                    _e('You need to check your Twitter setting','crum');
                }
                else
                {
                    $tweets['tweets_posts']     = $num;
                    $tweets['tweets_cahe_time'] = $refresh;
                    
                    set_transient('crumina_latest_tweets', $tweets, $refresh); 
                    $this->print_tweets($tweets);
                }
            }
            else 
            {
                _e('Cannot load tweets by external url','crum');
            }
        }
        else 
        {
            $this->print_tweets($cached_tweets);
        }
        
        echo $after_widget;
    }


    protected function print_tweets($user_tweets)
    {
        unset($user_tweets['tweets_posts']);
        unset($user_tweets['tweets_cahe_time']);

        if(is_array($user_tweets) && count($user_tweets) > 0)
        {
            foreach($user_tweets as $tweet)
            {


                echo '<div class="tweet"><span class="icon"> </span>';
                $post = $tweet['text'];
                $post = preg_replace("#http://[^<\s\n]+#", "<a href='\\0' target='_blank'>\\0</a>", $post);
                $post = preg_replace("/#\\w+/", "<a href='https://twitter.com/search?q=\\0&src=hash' target='_blank'>\\0</a>", $post);
                $post = str_replace("/search?q=#", "/search?q=%23", $post);
                $post = '<a href="https://twitter.com/' . $tweet["user"]["screen_name"] . '">' . $tweet['user']['name'] . ': </a>' . $post ;
                echo $post . "<br/>";
                echo "<div class='time'>" . human_time_diff(strtotime($tweet['created_at']), current_time('timestamp')) . ' ago</div>';
                echo '</div>';
            }
        }
        else
        {
            echo _e('No tweets','crum');
        }
    }

    public function update($new_instance, $old_instance)
    {
        $instance = $old_instance;

        $instance['title']    = trim(strip_tags($new_instance['title']));
        $instance['subtitle'] = trim(strip_tags($new_instance['subtitle']));
        $instance['num']      = trim(strip_tags($new_instance['num']));
        $instance['username'] = trim(strip_tags($new_instance['username']));
        $instance['refresh']  = trim(strip_tags($new_instance['refresh']));

        return $instance;
    }

    public function form($instance)
    {
        $defaults = array('title' => 'Latest Tweets', 'subtitle' => '', 'num' => '1', 'username' => 'Crumina', 'refresh' => '600');
        $instance = wp_parse_args($instance, $defaults);
    ?>

    <p>
      <label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:','crum'); ?></label>
      <input class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php echo $instance['title']; ?>" style="width:160px" />
    </p>
    
    <p>
      <label for="<?php echo $this->get_field_id( 'subtitle' ); ?>"><?php _e( 'Subtitle:','crum'); ?></label>
      <input class="widefat" id="<?php echo $this->get_field_id( 'subtitle' ); ?>" name="<?php echo $this->get_field_name( 'subtitle' ); ?>" value="<?php echo $instance['subtitle']; ?>" style="width:160px" />
    </p>

    <p>
      <label for="<?php echo $this->get_field_id('username'); ?>"><?php _e('Username:', 'crum'); ?></label>
      <input class="widefat" id="<?php echo $this->get_field_id('username'); ?>" name="<?php echo $this->get_field_name('username'); ?>" value="<?php echo $instance['username']; ?>" style="width:130px"/>
    </p>

    <p>
      <label for="<?php echo $this->get_field_id('num'); ?>"><?php _e('Number of Tweets:', 'crum'); ?></label>
      <input class="widefat" id="<?php echo $this->get_field_id('num'); ?>" name="<?php echo $this->get_field_name('num'); ?>" value="<?php echo $instance['num']; ?>" style="width:40px"/>
    </p>

    <p>
      <label for="<?php echo $this->get_field_id('refresh'); ?>"><?php _e('Cache refresh every', 'crum'); ?></label>
      <input class="widefat" id="<?php echo $this->get_field_id('refresh'); ?>" name="<?php echo $this->get_field_name('refresh'); ?>" value="<?php echo $instance['refresh']; ?>" style="width:40px"/>
        <?php _e('seconds', 'theory'); ?>
    </p>
    <?php
    }
}