## Installation

    npm install nodebb-plugin-gamification

## Template language
### topic/post.tpl
     <!-- IF posts.lvl -->
        <!-- IMPORT partials/topic/level.tpl -->
     <!-- ENDIF posts.lvl --> 
### profile.tpl
    <!-- IF lvl -->
        <div class="stat">
            <div class="human-readable-number" title="{lvl}">{lvl}</div>
               <span class="stat-label">Level</span>
        </div>
    <!-- ENDIF lvl -->

## Screenshots

Don't forget to add screenshots!

![](screenshot.png)
